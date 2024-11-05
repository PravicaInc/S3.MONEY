module <%- packageName %>::<%- packageName %> {
    // docs: https://docs.sui.io/standards/closed-loop-token
    use std::option::Self;

    use sui::event;
    use sui::coin::{Self, TreasuryCap};
    use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap};
    use sui::transfer;
    <% if (!icon_url.includes('none()')) { %>
    use sui::url;
    <% } %>
    use sui::tx_context::{sender, TxContext};

    use <%- packageName %>::denylist_rule::{Self as denylist, Denylist};
    use <%- packageName %>::pauser_rule::{Self as pauser, Pauser};
    use <%- packageName %>::token_supply::{Self, TokenSupply};

    // errors
    const EPaused: u64 = 200;
    const EWouldExceedMaxSupply: u64 = 201;

    // these values are placeholders in the template contract
    const MAX_SUPPLY: u64 = <%- maxSupply %>;
    const INITIAL_SUPPLY: u64 = <%- initialSupply %>;
    const SUPPLY_MUTABLE: bool = false;

    // witness
    struct <%- packageName.toUpperCase() %> has drop {}

    // Events: contract paused/unpaused
    struct EventPaused has copy, drop {}
    struct EventUnpaused has copy, drop {}

    // Events: address frozen/unfrozen
    struct EventTransfersFrozen has copy, drop { address: address }
    struct EventTransfersUnfrozen has copy, drop { address: address }

    // Events: mint, burn, transfer
    struct EventMint has copy, drop {
        address: address,
        amount: u64,
    }
    struct EventBurn has copy, drop {
        amount: u64,
    }
    struct EventTransfer has copy, drop {
        sender: address,
        recipient: address,
        amount: u64,
    }

    // Initialize contract objects at deployment time.
    fun init(otw: <%- packageName.toUpperCase() %>, ctx: &mut TxContext) {
        let treasury_cap = create_currency(otw, ctx);
        let (policy, policy_cap) = token::new_policy(&treasury_cap, ctx);
        let (supply, supply_cap) = token_supply::new_token_supply(&treasury_cap, MAX_SUPPLY, SUPPLY_MUTABLE, ctx);

        set_rules(&mut policy, &policy_cap, ctx);

        maybe_mint_initial_supply(&mut treasury_cap, &policy, &supply, ctx);

        transfer::public_transfer(treasury_cap, sender(ctx));
        transfer::public_transfer(policy_cap, sender(ctx));
        transfer::public_transfer(supply_cap, sender(ctx));

        token::share_policy(policy);
        token_supply::share_supply(supply);
    }

    // Public functions
    public fun is_frozen<T>(policy: &TokenPolicy<T>, recipient: address): bool {
        denylist::verifyp<T>(policy, recipient)
    }

    public fun is_paused<T>(policy: &TokenPolicy<T>): bool {
        pauser::paused<T>(policy)
    }

    public fun transfer<T>(policy: &TokenPolicy<T>, token: Token<T>, recipient: address, ctx: &mut TxContext) {
        let amount = token::value(&token);
        let request = token::transfer<T>(token, recipient, ctx);

        denylist::verify<T>(policy, &mut request, ctx);
        pauser::verify<T>(policy, &mut request, ctx);

        token::confirm_request<T>(policy, request, ctx);

        event::emit(EventTransfer {
            sender: sender(ctx),
            recipient: recipient,
            amount: amount,
            })
    }

    // Admin functions
    public fun mint<T>(cap: &mut TreasuryCap<T>, policy: &TokenPolicy<T>, supply: &TokenSupply<T>, amount: u64, recipient: address, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        let max_supply = token_supply::max_supply(supply);
        let total_supply = coin::total_supply(cap);

        if (max_supply > 0) {
            assert!(max_supply >= (total_supply + amount), EWouldExceedMaxSupply);
        };

        let token = token::mint(cap, amount, ctx);
        let request = token::transfer(token, recipient, ctx);

        token::confirm_with_treasury_cap(cap, request, ctx);

        event::emit(EventMint {
            address: recipient,
            amount: amount,
        })
    }

    public fun burn<T>(cap: &mut TreasuryCap<T>, policy: &TokenPolicy<T>, token: Token<T>) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        let amount = token::value(&token);
        token::burn(cap, token);

        event::emit(EventBurn {
            amount: amount,
        })
    }

    // Pause/unpause contract
    public fun pause<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);

        if (!paused) {
            pauser::set_config<T>(policy, cap, true, ctx);
            event::emit(EventPaused {});
        }
    }

    public fun unpause<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);

        if (paused) {
            pauser::set_config<T>(policy, cap, false, ctx);
            event::emit(EventUnpaused {});
        }
    }

    // Freeze/unfreeze address.
    public fun freeze_address<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, address: address, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        denylist::add_records(policy, cap, vector[ address ], ctx);
        event::emit(EventTransfersFrozen {
            address: address
        })
    }

    public fun unfreeze_address<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, address: address, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        denylist::remove_records(policy, cap, vector[ address ], ctx);
        event::emit(EventTransfersUnfrozen {
            address: address
        })
    }

    // Internal Functions

    fun create_currency<T: drop>(otw: T, ctx: &mut TxContext): TreasuryCap<T> {
        let (treasury_cap, metadata) = coin::create_currency(
            otw,
            <%- decimals %> /* decimals */,
            b"<%- ticker %>" /* symbol */,
            b"<%- name %>" /* name */,
            b"<%- description %>" /* description */,
            <%- icon_url %> /* optional icon url */,
            ctx
        );

        transfer::public_freeze_object(metadata);

        treasury_cap
    }

    // Marked "friend" so the tests can call it.
    public(friend) fun set_rules<T>(policy: &mut TokenPolicy<T>, cap: &TokenPolicyCap<T>, ctx: &mut TxContext) {
        // By default, the contract is not paused.
        pauser::set_config<T>(policy, cap, false, ctx);

        // At the moment, transfer is only operation we really check against.
        token::add_rule_for_action<T, Pauser>(policy, cap, token::transfer_action(), ctx);
        token::add_rule_for_action<T, Denylist>(policy, cap, token::transfer_action(), ctx);

        // Unsupported operations: spend; to_coin, from_coin (sui coin <-> token).
        token::add_rule_for_action<T, Pauser>(policy, cap, token::spend_action(), ctx);
        token::add_rule_for_action<T, Denylist>(policy, cap, token::spend_action(), ctx);
        token::add_rule_for_action<T, Pauser>(policy, cap, token::to_coin_action(), ctx);
        token::add_rule_for_action<T, Denylist>(policy, cap, token::to_coin_action(), ctx);
        token::add_rule_for_action<T, Pauser>(policy, cap, token::from_coin_action(), ctx);
        token::add_rule_for_action<T, Denylist>(policy, cap, token::from_coin_action(), ctx);
    }

    fun maybe_mint_initial_supply<T>(cap: &mut TreasuryCap<T>, policy: &TokenPolicy<T>, supply: &TokenSupply<T>, ctx: &mut TxContext) {
         if (INITIAL_SUPPLY > 0) {
             mint(cap, policy, supply, INITIAL_SUPPLY, sender(ctx), ctx);
             event::emit(EventTransfer {
                 sender: @0x0,
                 recipient: sender(ctx),
                 amount: INITIAL_SUPPLY,
             })
         }
    }

    #[test_only] friend <%- packageName %>::<%- packageName %>_tests;
    #[test_only] friend <%- packageName %>::mint_tests;
    #[test_only] friend <%- packageName %>::transfer_tests;
    #[test_only] public fun init_for_testing(ctx: &mut TxContext) { init(<%- packageName.toUpperCase() %> {}, ctx) }
    #[test_only] public fun initial_supply(): u64 { INITIAL_SUPPLY }
}
