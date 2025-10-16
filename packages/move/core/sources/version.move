/// Core version and governance module for TortoiseOS
module tortoise_core::version {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// Version info for TortoiseOS
    public struct Version has key {
        id: UID,
        major: u64,
        minor: u64,
        patch: u64,
    }

    /// Initialize version registry
    fun init(ctx: &mut TxContext) {
        let version = Version {
            id: object::new(ctx),
            major: 0,
            minor: 1,
            patch: 0,
        };
        transfer::share_object(version);
    }

    /// Get version string
    public fun get_version(version: &Version): (u64, u64, u64) {
        (version.major, version.minor, version.patch)
    }

    #[test]
    fun test_version() {
        use sui::test_scenario;

        let owner = @0xA;
        let scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;

        {
            let ctx = test_scenario::ctx(scenario);
            init(ctx);
        };

        test_scenario::next_tx(scenario, owner);
        {
            let version = test_scenario::take_shared<Version>(scenario);
            let (major, minor, patch) = get_version(&version);
            assert!(major == 0 && minor == 1 && patch == 0, 0);
            test_scenario::return_shared(version);
        };

        test_scenario::end(scenario_val);
    }
}
