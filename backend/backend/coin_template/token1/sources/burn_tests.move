#[test_only]
module <%- packageName %>::burn_tests {
    use sui::coin::{Self, TreasuryCap};

    use sui::token::{Token, TokenPolicy, TokenPolicyCap};

    use sui::test_scenario::{Self, next_tx, ctx};

    use <%- packageName %>::<%- packageName %>::{Self, <%- packageName.toUpperCase() %>, pause};

    const MINT_AMOUNT: u64 = 100_00;

    const DEPLOYER: address = @0x0;
    const ALICE: address = @0x1;

    #[test]
    fun can_burn() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, DEPLOYER, ctx(&mut scenario));

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == MINT_AMOUNT, 0);

            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::burn(&mut treasurycap, &policy, token);

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == 0, 0);

            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun can_burn_other_address() {
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

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == MINT_AMOUNT, 0);

            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::transfer(&policy, token, DEPLOYER, ctx(&mut scenario));

            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::burn(&mut treasurycap, &policy, token);

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == 0, 0);

            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = <%- packageName %>::<%- packageName %>::EPaused)]
    fun burn_if_paused_fail() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, MINT_AMOUNT, DEPLOYER, ctx(&mut scenario));

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == MINT_AMOUNT, 0);

            test_scenario::return_to_address(DEPLOYER, treasurycap);
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
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::burn(&mut treasurycap, &policy, token);

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        next_tx(&mut scenario, DEPLOYER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == 0, 0);

            test_scenario::return_to_address(DEPLOYER, treasurycap);
        };

        test_scenario::end(scenario);
    }
}
