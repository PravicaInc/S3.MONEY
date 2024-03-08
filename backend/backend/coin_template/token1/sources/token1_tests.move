#[test_only]
module <%- packageName %>::<%- packageName %>_tests {
    use sui::coin::TreasuryCap;
    // use sui::tx_context::TxContext;

    use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap};
    use sui::token_test_utils as test;

    use sui::test_scenario::{Self, next_tx, ctx};

    use <%- packageName %>::<%- packageName %>::{Self, <%- packageName.toUpperCase() %>, freeze_address, pause, set_rules};
    use <%- packageName %>::pauser_rule as pauser;
    use <%- packageName %>::denylist_rule as denylist;

    const EInvalidValue: u64 = 0;

    const MINT_AMOUNT: u64 = 100_00;

    const DEPLOYER: address = @0x0;
    const ALICE: address = @0x1;
    const BOB: address = @0x2;
    const CHARLIE: address = @0x3;

    #[test]
    fun can_mint() {
        let ctx = &mut test::ctx(DEPLOYER);
        let (policy, cap) = test::get_policy(ctx);
        set_rules(&mut policy, &cap, ctx);

        let token = test::mint(100_00, ctx);
        let request = token::transfer(token, ALICE, ctx);

        denylist::verify(&policy, &mut request, ctx);
        pauser::verify(&policy, &mut request, ctx);

        token::confirm_request(&policy, request, ctx);

        test::return_policy(policy, cap);
    }

    #[test]
    fun mint_to_address() {

        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
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
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);
            let value = token::value<<%- packageName.toUpperCase() %>>(&token);
            assert!(value == MINT_AMOUNT, EInvalidValue);
            test_scenario::return_to_address(ALICE, token);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = <%- packageName %>::<%- packageName %>::EPaused)]
    fun mint_if_paused_fail() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            pause(&policycap, &mut policy, ctx(&mut scenario));

            test_scenario::return_to_address(DEPLOYER, policycap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policycap, MINT_AMOUNT, ALICE, ctx(&mut scenario));

            test_scenario::return_shared(policycap);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
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

    #[test]
    fun mint_to_frozen_address() {

        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            freeze_address(&policycap, &mut policy, ALICE, ctx(&mut scenario));
            freeze_address(&policycap, &mut policy, BOB, ctx(&mut scenario));
            freeze_address(&policycap, &mut policy, CHARLIE, ctx(&mut scenario));
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, policycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::check_frozen(&policy, ALICE);
            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, BOB, ctx(&mut scenario));
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
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

    #[test]
    fun check_if_frozen() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario))
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);

            freeze_address(&policycap, &mut policy, ALICE, ctx(&mut scenario));

            test_scenario::return_to_address(DEPLOYER, policycap);
            test_scenario::return_shared(policy);
        };

        // alice checks if she is frozen
        next_tx(&mut scenario, DEPLOYER);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(<%- packageName %>::check_frozen(&policy, ALICE), 0);
            test_scenario::return_shared(policy);
        };


        // alice checks if she is frozen
        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(<%- packageName %>::check_frozen(&policy, ALICE), 0);
            test_scenario::return_shared(policy);
        };

        // bob checks if alice is frozen
        next_tx(&mut scenario, BOB);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(<%- packageName %>::check_frozen(&policy, ALICE), 0);
            test_scenario::return_shared(policy);
        };

        // charlie checks if he is frozen using ctx sender
        next_tx(&mut scenario, CHARLIE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(!<%- packageName %>::check_frozen(&policy, CHARLIE), 0);
            test_scenario::return_shared(policy);
        };

        test_scenario::end(scenario);
    }

}
