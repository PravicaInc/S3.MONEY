module <%- packageName %>::denylist_rule {
    // adapted from https://github.com/MystenLabs/sui/blob/testnet/examples/move/token/sources/rules/denylist_rule.move

    // copyright on original module:
    // // Copyright (c) Mysten Labs, Inc.
    // // SPDX-License-Identifier: Apache-2.0

    use std::option;
    use std::vector;
    use sui::bag::{Self, Bag};
    use sui::tx_context::TxContext;
    use sui::token::{Self, TokenPolicy, TokenPolicyCap, ActionRequest};

    /// Trying to `verify` but the sender or the recipient is on the denylist.
    const EUserBlocked: u64 = 100;

    /// The Rule witness.
    struct Denylist has drop {}

    /// Verifies that the sender and the recipient (if set) are not on the
    /// denylist for the given action.
    public fun verify<T>(
        policy: &TokenPolicy<T>,
        request: &mut ActionRequest<T>,
        ctx: &mut TxContext
    ) {
        // early return if no records are added
        if (!has_config(policy)) {
            token::add_approval(Denylist {}, request, ctx);
            return
        };

        let config = config(policy);
        let sender = token::sender(request);
        let receiver = token::recipient(request);

        assert!(!bag::contains(config, sender), EUserBlocked);

        if (option::is_some(&receiver)) {
            let receiver = *option::borrow(&receiver);
            assert!(!bag::contains(config, receiver), EUserBlocked);
        };

        token::add_approval(Denylist {}, request, ctx);
    }

    public fun verifyp<T>(policy: &TokenPolicy<T>, recipient: address): bool {
        // early return if no records are added
        if (!has_config(policy)) {
            return false
        };

        let config = config(policy);

        bag::contains(config, recipient)
    }

    // === Protected: List Management ===

    /// Adds records to the `denylist_rule` for a given action. The Policy
    /// owner can batch-add records.
    public fun add_records<T>(
        policy: &mut TokenPolicy<T>,
        cap: &TokenPolicyCap<T>,
        addresses: vector<address>,
        ctx: &mut TxContext
    ) {
        if (!has_config(policy)) {
            token::add_rule_config(Denylist {}, policy, cap, bag::new(ctx), ctx);
        };

        let config_mut = config_mut(policy, cap);
        while (vector::length(&addresses) > 0) {
            bag::add(config_mut, vector::pop_back(&mut addresses), true)
        };
    }

    /// Removes records from the `denylist_rule` for a given action. The Policy
    /// owner can batch-remove records.
    public fun remove_records<T>(
        policy: &mut TokenPolicy<T>,
        cap: &TokenPolicyCap<T>,
        addresses: vector<address>,
        _ctx: &mut TxContext
    ) {
        let config_mut = config_mut(policy, cap);

        while (vector::length(&addresses) > 0) {
            let record = vector::pop_back(&mut addresses);
            if (bag::contains(config_mut, record)) {
                let _: bool = bag::remove(config_mut, record);
            };
        };
    }

    // === Internal ===

    fun has_config<T>(self: &TokenPolicy<T>): bool {
        token::has_rule_config_with_type<T, Denylist, Bag>(self)
    }

    fun config<T>(self: &TokenPolicy<T>): &Bag {
        token::rule_config<T, Denylist, Bag>(Denylist {}, self)
    }

    fun config_mut<T>(self: &mut TokenPolicy<T>, cap: &TokenPolicyCap<T>): &mut Bag {
        token::rule_config_mut(Denylist {}, self, cap)
    }
}
