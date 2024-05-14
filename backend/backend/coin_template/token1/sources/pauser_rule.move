module <%- packageName %>::pauser_rule {
    // Pause a contract
    use sui::token::{Self, TokenPolicy, TokenPolicyCap, ActionRequest};
    use sui::tx_context::TxContext;

    // Cannot perform action, contract is paused.
    const EPaused: u64 = 200;

    /// The Rule witness.
    struct Pauser has drop {}

    struct Config has store, drop {
        paused: bool,
    }

    public fun verify<T>(policy: &TokenPolicy<T>, request: &mut ActionRequest<T>, ctx: &mut TxContext) {
        if (!token::has_rule_config<T, Pauser>(policy)) {
            return token::add_approval(Pauser {}, request, ctx)
        };

        let config: &Config = token::rule_config(Pauser {}, policy);
        assert!(!config.paused, EPaused);

        return token::add_approval(Pauser {}, request, ctx)
    }

    public fun set_config<T>(policy: &mut TokenPolicy<T>, cap: &TokenPolicyCap<T>, paused: bool, ctx: &mut TxContext) {
        // if there's no stored config for the rule, add a new one
        if (!token::has_rule_config<T, Pauser>(policy)) {
            let config = Config { paused };
            token::add_rule_config(Pauser {}, policy, cap, config, ctx);
        } else {
            let config: &mut Config = token::rule_config_mut(Pauser {}, policy, cap);
            config.paused = paused;
        }
    }

    public fun paused<T>(policy: &TokenPolicy<T>): bool {
        token::rule_config<T, Pauser, Config>(Pauser {}, policy).paused
    }
}
