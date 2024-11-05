#[test_only]
module <%- packageName %>::denylist_rule_tests {
    // adapted from https://github.com/MystenLabs/sui/blob/testnet/examples/move/token/sources/rules/denylist_rule.move

    // copyright on original module:
    // // Copyright (c) Mysten Labs, Inc.
    // // SPDX-License-Identifier: Apache-2.0

    use std::string::utf8;
    use std::option::{none, some};
    use sui::token;
    use sui::token_test_utils::{Self as test, TEST};

    use <%- packageName %>::denylist_rule::{Self as denylist, Denylist};

    #[test]
    // Scenario: add a denylist with addresses, sender is not on the list and
    // transaction is confirmed.
    fun denylist_pass_not_on_the_list() {
        let ctx = &mut sui::tx_context::dummy();
        let (policy, cap) = test::get_policy(ctx);

        // first add the list for action and then add records
        token::add_rule_for_action<TEST, Denylist>(&mut policy, &cap, utf8(b"action"), ctx);
        denylist::add_records(&mut policy, &cap, vector[ @0x1 ], ctx);

        let request = token::new_request(utf8(b"action"), 100, none(), none(), ctx);

        denylist::verify(&policy, &mut request, ctx);
        token::confirm_request(&policy, request, ctx);
        test::return_policy(policy, cap);
    }

    #[test, expected_failure(abort_code = <%- packageName %>::denylist_rule::EUserBlocked)]
    // Scenario: add a denylist with addresses, sender is on the list and
    // transaction fails with `EUserBlocked`.
    fun denylist_on_the_list_banned_fail() {
        let ctx = &mut sui::tx_context::dummy();
        let (policy, cap) = test::get_policy(ctx);

        token::add_rule_for_action<TEST, Denylist>(&mut policy, &cap, utf8(b"action"), ctx);
        denylist::add_records(&mut policy, &cap, vector[ @0x0 ], ctx);

        let request = token::new_request(utf8(b"action"), 100, none(), none(), ctx);

        denylist::verify(&policy, &mut request, ctx);

        abort 1337
    }

    #[test, expected_failure(abort_code = <%- packageName %>::denylist_rule::EUserBlocked)]
    // Scenario: add a denylist with addresses, recipient is on the list and
    // transaction fails with `EUserBlocked`.
    fun denylist_recipient_on_the_list_banned_fail() {
        let ctx = &mut sui::tx_context::dummy();
        let (policy, cap) = test::get_policy(ctx);

        token::add_rule_for_action<TEST, Denylist>(&mut policy, &cap, utf8(b"action"), ctx);
        denylist::add_records(&mut policy, &cap, vector[ @0x1 ], ctx);

        let request = token::new_request(utf8(b"action"), 100, some(@0x1), none(), ctx);

        denylist::verify(&policy, &mut request, ctx);

        abort 1337
    }
}
