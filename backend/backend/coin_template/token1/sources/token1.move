module <%- packageName %>::<%- packageName %> {
    // docs: https://docs.sui.io/standards/closed-loop-token
    use std::option::Self;

    use sui::event;
    use sui::coin::{Self, TreasuryCap};
    use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap};
    use sui::transfer;
    use sui::tx_context::{sender, TxContext};

    use <%- packageName %>::denylist_rule::{Self as denylist, Denylist};
    use <%- packageName %>::pauser_rule::{Self as pauser, Pauser};

    // errors
    const EPaused: u64 = 200;

    // witness
    struct <%- packageName.toUpperCase() %> has drop {}

    // Events: contract paused/unpaused
    struct TokenPaused has copy, drop {}
    struct TokenUnpaused has copy, drop {}

    // Events: address frozen/unfrozen
    struct TransfersFrozen has copy, drop { address: address }
    struct TransfersUnfrozen has copy, drop { address: address }

    // Initialize contract objects at deployment time.
    fun init(otw: <%- packageName.toUpperCase() %>, ctx: &mut TxContext) {
        let treasury_cap = create_currency(otw, ctx);
        let (policy, policy_cap) = token::new_policy(&treasury_cap, ctx);

        set_rules(&mut policy, &policy_cap, ctx);

        transfer::public_transfer(treasury_cap, sender(ctx));
        transfer::public_transfer(policy_cap, sender(ctx));
        token::share_policy(policy);
    }

    // Public functions
    public fun check_frozen<T>(_policy: &TokenPolicy<T>, _recipient: address, _ctx: &TxContext): bool {

        // let request = token::new_request<T>(token::transfer_action(), 1, option::some(recipient), option::none(), ctx);
        // denylist::verifyp<T>(policy, request)

        false
    }

    public fun transfer<T>(policy: &TokenPolicy<T>, token: Token<T>, recipient: address, ctx: &mut TxContext) {
        let request = token::transfer<T>(token, recipient, ctx);

        denylist::verify<T>(policy, &mut request, ctx);
        pauser::verify<T>(policy, &mut request, ctx);

        token::confirm_request<T>(policy, request, ctx);
    }

    // Admin functions

    public fun mint<T>(cap: &mut TreasuryCap<T>, policy: &TokenPolicy<T>, amount: u64, recipient: address, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        let token = token::mint(cap, amount, ctx);
        let request = token::transfer(token, recipient, ctx);

        token::confirm_with_treasury_cap(cap, request, ctx);
    }

    public fun burn<T>(cap: &mut TreasuryCap<T>, policy: &TokenPolicy<T>, token: Token<T>) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        token::burn(cap, token)
    }

    // Pause/unpause contract
    public fun pause<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, ctx: &mut TxContext) {
        pauser::set_config<T>(policy, cap, true, ctx);
        event::emit(TokenPaused {});
    }

    public fun unpause<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, ctx: &mut TxContext) {
        pauser::set_config<T>(policy, cap, false, ctx);
        event::emit(TokenUnpaused {});
    }

    // Freeze/unfreeze address.
    public fun freeze_address<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, address: address, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        denylist::add_records(policy, cap, vector[ address ], ctx);
        event::emit(TransfersFrozen {
            address: address
        })
    }

    public fun unfreeze_address<T>(cap: &TokenPolicyCap<T>, policy: &mut TokenPolicy<T>, address: address, ctx: &mut TxContext) {
        let paused = pauser::paused<T>(policy);
        assert!(!paused, EPaused);

        denylist::remove_records(policy, cap, vector[ address ], ctx);
        event::emit(TransfersUnfrozen {
            address: address
        })
    }

    // Internal Functions

    fun create_currency<T: drop>(otw: T, ctx: &mut TxContext): TreasuryCap<T> {
        let (treasury_cap, metadata) = coin::create_currency(
            otw, <%- decimals %> /* decimals */,
            b"<%- packageName.toUpperCase() %>" /* symbol */,
            b"<%- name %>" /* name */,
            b"<%- description %>" /* description */,
            option::none() /* optional icon url */,
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
        token::add_rule_for_action<T, Denylist>(policy, cap, token::transfer_action(), ctx);
        token::add_rule_for_action<T, Pauser>(policy, cap, token::transfer_action(), ctx);

        // Unsupported operations: spend; to_coin, from_coin (sui coin <-> token).
        token::add_rule_for_action<T, Denylist>(policy, cap, token::spend_action(), ctx);
        token::add_rule_for_action<T, Pauser>(policy, cap, token::spend_action(), ctx);
        token::add_rule_for_action<T, Denylist>(policy, cap, token::to_coin_action(), ctx);
        token::add_rule_for_action<T, Pauser>(policy, cap, token::to_coin_action(), ctx);
        token::add_rule_for_action<T, Denylist>(policy, cap, token::from_coin_action(), ctx);
        token::add_rule_for_action<T, Pauser>(policy, cap, token::from_coin_action(), ctx);
    }

    #[test_only] friend <%- packageName %>::<%- packageName %>_tests;
    #[test_only] public fun init_for_testing(ctx: &mut TxContext) { init(<%- packageName.toUpperCase() %> {}, ctx) }
}
