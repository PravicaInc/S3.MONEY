#[test_only]
module <%- packageName %>::transfer_tests {
    use sui::coin::TreasuryCap;
    use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap};

    use sui::test_scenario::{Self, next_tx, ctx};

    use <%- packageName %>::<%- packageName %>::{Self, <%- packageName.toUpperCase() %>, freeze_address, pause};
    use <%- packageName %>::pauser_rule as pauser;
    use <%- packageName %>::denylist_rule as denylist;

    const EInvalidValue: u64 = 0;

    const MINT_AMOUNT: u64 = 100_00;

    const DEPLOYER: address = @0x0;
    const ALICE: address = @0x1;
    const BOB: address = @0x2;

    #[test]
    fun transfer_to_address() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, ALICE, ctx(&mut scenario));

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            <%- packageName %>::transfer(&policy, token, BOB, ctx(&mut scenario));
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, BOB);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            test_scenario::return_to_address(BOB, token);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = pauser::EPaused)]
    fun transfer_to_address_if_paused_fail() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, ALICE, ctx(&mut scenario));
            pause(&policycap, &mut policy, ctx(&mut scenario));

            test_scenario::return_to_address(DEPLOYER, policycap);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            <%- packageName %>::transfer(&policy, token, BOB, ctx(&mut scenario));
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, BOB);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            test_scenario::return_to_address(BOB, token);
        };

        test_scenario::end(scenario);
    }


    #[test, expected_failure(abort_code = denylist::EUserBlocked)]
    fun transfer_to_address_if_sender_frozen_fail() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, ALICE, ctx(&mut scenario));
            freeze_address(&policycap, &mut policy, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(DEPLOYER, policycap);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            <%- packageName %>::transfer(&policy, token, BOB, ctx(&mut scenario));
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, BOB);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            test_scenario::return_to_address(BOB, token);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = denylist::EUserBlocked)]
    fun transfer_to_address_if_recipient_frozen_fail() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, ALICE, ctx(&mut scenario));
            freeze_address(&policycap, &mut policy, BOB, ctx(&mut scenario));

            test_scenario::return_to_address(DEPLOYER, policycap);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            <%- packageName %>::transfer(&policy, token, BOB, ctx(&mut scenario));
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, BOB);
        {
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            test_scenario::return_to_address(BOB, token);
        };

        test_scenario::end(scenario);
    }
}
