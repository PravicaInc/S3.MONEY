#[test_only]
module <%- packageName %>::<%- packageName %>_tests {
    use sui::token::{TokenPolicy, TokenPolicyCap};

    use sui::test_scenario::{Self, next_tx, ctx};

    use <%- packageName %>::<%- packageName %>::{Self, <%- packageName.toUpperCase() %>, freeze_address};

    const DEPLOYER: address = @0x0;
    const ALICE: address = @0x1;
    const BOB: address = @0x2;
    const CHARLIE: address = @0x3;

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
            assert!(<%- packageName %>::is_frozen(&policy, ALICE), 0);
            test_scenario::return_shared(policy);
        };

        // alice checks if she is frozen
        next_tx(&mut scenario, ALICE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(<%- packageName %>::is_frozen(&policy, ALICE), 0);
            test_scenario::return_shared(policy);
        };

        // bob checks if alice is frozen
        next_tx(&mut scenario, BOB);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(<%- packageName %>::is_frozen(&policy, ALICE), 0);
            test_scenario::return_shared(policy);
        };

        // charlie checks if he is frozen using ctx sender
        next_tx(&mut scenario, CHARLIE);
        {
            let policy = test_scenario::take_shared<TokenPolicy<<%- packageName.toUpperCase() %>>>(&scenario);
            assert!(!<%- packageName %>::is_frozen(&policy, CHARLIE), 0);
            test_scenario::return_shared(policy);
        };

        test_scenario::end(scenario);
    }
}
