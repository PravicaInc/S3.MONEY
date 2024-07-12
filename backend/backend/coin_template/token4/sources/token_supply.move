module <%- packageName %>::token_supply {
    use sui::coin::TreasuryCap;
    use sui::event;
   
    // errors
    const EInvalid: u64 = 300;

    public struct TokenSupplyCap<phantom T> has key, store {
        id: UID,
        forId: ID,
    }

    public struct TokenSupply<phantom T> has key {
        id: UID,
        max_supply: u64,
        mutable: bool,
    }

    // event
    public struct TokenSupplyCreated<phantom T> has copy, drop {
        // ID of the `TokenSupply` created
        id: ID,
        // currently always true
        is_mutable: bool,
    }

    public fun new_token_supply<T>(_: &TreasuryCap<T>, max: u64, mutable: bool, ctx: &mut TxContext): (TokenSupply<T>, TokenSupplyCap<T>) {
        let supply = TokenSupply {
            id: object::new(ctx),
            max_supply: max,
            mutable: mutable,
        };

        let cap = TokenSupplyCap {
            id: object::new(ctx),
            forId: object::id(&supply),
        };

        (supply, cap)
    }

    #[allow(lint(share_owned))]
    public fun share_supply<T>(supply: TokenSupply<T>) {
        event::emit(TokenSupplyCreated<T> {
            id: object::id(&supply),
            is_mutable: supply.mutable,
        });

        transfer::share_object(supply)
    }

    public fun max_supply<T>(supply: &TokenSupply<T>): u64 {
        supply.max_supply
    }

    public fun increase_supply<T>(_: &TokenSupplyCap<T>, supply: &mut TokenSupply<T>, new_max: u64) {
        assert!(supply.mutable, EInvalid);
        assert!(new_max >= supply.max_supply, EInvalid);

        supply.max_supply = new_max
    }
}
