/// Core version module for TortoiseOS
module tortoise_core::version {
    use sui::object::UID;
    use sui::tx_context::TxContext;

    /// Version info for TortoiseOS
    public struct Version has key {
        id: UID,
        major: u64,
        minor: u64,
        patch: u64,
    }

    /// Get version string
    public fun get_version(version: &Version): (u64, u64, u64) {
        (version.major, version.minor, version.patch)
    }
}
