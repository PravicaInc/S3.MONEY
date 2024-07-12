#[test_only]
module <%- packageName %>::allocation_tests {
    use sui::coin::TreasuryCap;
    use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap};

    use sui::test_scenario::{Self, next_tx, ctx};

    use <%- packageName %>::<%- packageName %>::{Self, <%- packageName.toUpperCase() %>, freeze_address, pause};
    use <%- packageName %>::pauser_rule::EPaused;
    use <%- packageName %>::token_supply::TokenSupply;
    use <%- packageName %>::denylist_rule as denylist;
    use <%- packageName %>::cash_::CashInCap;

    const EInvalidValue: u64 = 0;

    const MINT_AMOUNT: u64 = 100_00;

    const DEPLOYER: address = @0x0;
    const MINTER: address = @minter;
    const PAUSER: address = @pauser;
    const ALLOCATOR: address = @casher;
    const ALICE: address = @0x1;

    #[test]
    fun allocate_to_address() {
        let mut scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, MINTER);
        {
            let mut treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, ALLOCATOR, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, ALLOCATOR);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let cash_cap = test_scenario::take_from_sender<CashInCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);

            <%- packageName %>::allocate(&cash_cap, &policy, token, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(ALLOCATOR, cash_cap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, ALICE);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);

            assert!(value == MINT_AMOUNT, EInvalidValue);

            test_scenario::return_to_address(ALICE, token);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = EPaused)]
    fun allocate_while_paused_fail() {
        let mut scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, MINTER);
        {
            let mut treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, ALLOCATOR, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, PAUSER);
        {
            let mut policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            pause(&policycap, &mut policy, ctx(&mut scenario));

            test_scenario::return_to_address(PAUSER, policycap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, ALLOCATOR);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let cash_cap = test_scenario::take_from_sender<CashInCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);

            <%- packageName %>::allocate(&cash_cap, &policy, token, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(ALLOCATOR, cash_cap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, ALICE);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);

            assert!(value == MINT_AMOUNT, EInvalidValue);

            test_scenario::return_to_address(ALICE, token);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = denylist::EUserBlocked)]
    fun allocate_to_frozen_fail() {
        let mut scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, MINTER);
        {
            let mut treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, ALLOCATOR, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, PAUSER);
        {
            let mut policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            freeze_address(&policycap, &mut policy, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(PAUSER, policycap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, ALLOCATOR);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let cash_cap = test_scenario::take_from_sender<CashInCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);

            <%- packageName %>::allocate(&cash_cap, &policy, token, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(ALLOCATOR, cash_cap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, ALICE);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);

            assert!(value == MINT_AMOUNT, EInvalidValue);

            test_scenario::return_to_address(ALICE, token);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = denylist::EUserBlocked)]
    fun allocate_from_frozen_fail() {
        let mut scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, MINTER);
        {
            let mut treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, ALLOCATOR, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, PAUSER);
        {
            let mut policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            freeze_address(&policycap, &mut policy, ALLOCATOR, ctx(&mut scenario));

            test_scenario::return_to_address(PAUSER, policycap);
            test_scenario::return_shared(policy);
        };


        next_tx(&mut scenario, ALLOCATOR);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let cash_cap = test_scenario::take_from_sender<CashInCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);

            <%- packageName %>::allocate(&cash_cap, &policy, token, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(ALLOCATOR, cash_cap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, ALICE);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);

            assert!(value == MINT_AMOUNT, EInvalidValue);

            test_scenario::return_to_address(ALICE, token);
        };

        test_scenario::end(scenario);
    }
}
