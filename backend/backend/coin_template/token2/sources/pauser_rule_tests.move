#[test_only]
module <%- packageName %>::pauser_rule_tests {
    use std::string::utf8;
    use std::option::none;
    use sui::token;
    use sui::token_test_utils::{Self as test, TEST};

    use <%- packageName %>::pauser_rule::{Self as pauser, Pauser};

    #[test]
    // Scenario: pause, then unpause, transfers should not be blocked
    fun pauser_toggle_pass() {
        let ctx = &mut sui::tx_context::dummy();
        let (policy, cap) = test::get_policy(ctx);

        let config = true;
        pauser::set_config(&mut policy, &cap, config, ctx);

        token::add_rule_for_action<TEST, Pauser>(&mut policy, &cap, utf8(b"transfer"), ctx);
        token::remove_rule_for_action<TEST, Pauser>(&mut policy, &cap, utf8(b"transfer"), ctx);
        {
            let request = token::new_request(utf8(b"transfer"), 100, none(), none(), ctx);
            token::confirm_request(&policy, request, ctx);
        };

        test::return_policy(policy, cap);
    }

    #[test, expected_failure(abort_code = <%- packageName %>::pauser_rule::EPaused)]
    // Scenario: pause, then verify that transfers are blocked
    fun pauser_paused_transfer_fail() {
        let ctx = &mut sui::tx_context::dummy();
        let (policy, cap) = test::get_policy(ctx);

        let config = true;
        pauser::set_config(&mut policy, &cap, config, ctx);

        token::add_rule_for_action<TEST, Pauser>(&mut policy, &cap, utf8(b"transfer"), ctx);

        let request = token::new_request(utf8(b"transfer"), 101, none(), none(), ctx);
        pauser::verify(&policy, &mut request, ctx);

        // should not end up here
        abort 1337
    }
}
