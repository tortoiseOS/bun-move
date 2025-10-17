/// Governance module for $LAB token holders
module tortoise_core::governance {
    use sui::object::UID;
    use sui::tx_context::TxContext;

    /// One-time witness for governance initialization
    public struct GOVERNANCE has drop {}

    /// Governance token ($LAB)
    public struct LAB has drop {}

    /// Treasury for governance
    public struct Treasury has key {
        id: UID,
    }

    /// Proposal for governance decisions
    public struct Proposal has key, store {
        id: UID,
        description: vector<u8>,
        yes_votes: u64,
        no_votes: u64,
        executed: bool,
    }

    /// Initialize governance with treasury
    fun init(_witness: GOVERNANCE, _ctx: &mut TxContext) {
        // TODO: Initialize treasury with coin treasury cap
    }
}
