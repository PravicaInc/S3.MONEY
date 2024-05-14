module <%- packageName %>::cash_ {
  use sui::coin::TreasuryCap;
  use sui::object::{Self, UID};
  use sui::tx_context::TxContext;

  struct CashInCap<phantom T> has key, store {
    id: UID,
    address: address,
  }

  public fun new_cashin<T>(_: &TreasuryCap<T>, casher: address, ctx: &mut TxContext): CashInCap<T> {
    let cap = CashInCap {
      id: object::new(ctx),
      address: casher,
    };

    cap
  }

  public fun get_address<T>(cash_in: &CashInCap<T>): address {
    cash_in.address
  }
}
