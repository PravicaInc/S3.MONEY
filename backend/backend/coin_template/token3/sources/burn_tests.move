#[test_only]
module <%- packageName %>::burn_tests {
    use sui::coin::{Self, TreasuryCap};

    use sui::token::{Token, TokenPolicy, TokenPolicyCap};

    use sui::test_scenario::{Self, next_tx, ctx};

    use <%- packageName %>::<%- packageName %>::{Self, <%- packageName.toUpperCase() %>, pause, initial_supply};
    use <%- packageName %>::token_supply::TokenSupply;

    const MINT_AMOUNT: u64 = 100_00;

    const DEPLOYER: address = @0x0;
    const MINTER: address = @minter;
    const PAUSER: address = @pauser;
    const ALICE: address = @0x1;

    #[test]
    fun can_burn() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, MINTER, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == MINT_AMOUNT + initial_supply(), 0);

            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::burn(&mut treasurycap, &policy, token);

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == initial_supply(), 0);

            test_scenario::return_to_address(MINTER, treasurycap);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun can_burn_other_address() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, ALICE, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == MINT_AMOUNT + initial_supply(), 0);

            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::transfer(&policy, token, MINTER, ctx(&mut scenario));

            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::burn(&mut treasurycap, &policy, token);

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == initial_supply(), 0);

            test_scenario::return_to_address(MINTER, treasurycap);
        };

        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = <%- packageName %>::<%- packageName %>::EPaused)]
    fun burn_if_paused_fail() {
        let scenario = test_scenario::begin(DEPLOYER);
        {
            <%- packageName %>::init_for_testing(ctx(&mut scenario));
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let supply = test_scenario::take_shared<TokenSupply<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::mint(&mut treasurycap, &policy, &supply, MINT_AMOUNT, MINTER, ctx(&mut scenario));

            test_scenario::return_shared(supply);
            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == MINT_AMOUNT + initial_supply(), 0);

            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, PAUSER);
        {
            let policycap = test_scenario::take_from_sender<TokenPolicyCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);

            pause(&policycap, &mut policy, ctx(&mut scenario));

            test_scenario::return_to_address(PAUSER, policycap);
            test_scenario::return_shared(policy);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            let token = test_scenario::take_from_sender<Token<<%- packageName.toUpperCase() %>>>(&scenario);

            <%- packageName %>::burn(&mut treasurycap, &policy, token);

            test_scenario::return_shared(policy);
            test_scenario::return_to_address(MINTER, treasurycap);
        };

        next_tx(&mut scenario, MINTER);
        {
            let treasurycap = test_scenario::take_from_sender<TreasuryCap<<%- packageName.toUpperCase() %>>>(&scenario);

            let supply = coin::total_supply(&treasurycap);
            assert!(supply == initial_supply(), 0);

            test_scenario::return_to_address(MINTER, treasurycap);
        };

        test_scenario::end(scenario);
    }
}
