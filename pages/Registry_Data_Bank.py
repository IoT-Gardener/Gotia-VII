import streamlit as st
import time
from pathlib import Path
from PIL import Image


_LOREM_IPSUM = """
Welcome to the Rust & Ruin Registry Data Bank, a repository of information available to selected Freelancer's to aid in their activites on the planet of Gotia VII. We are constantly looking to expand our archive, if you recover any drives of interest please upload them to your local representative and we will review the content and add it to the data bank.
"""


def stream_data():
    for word in _LOREM_IPSUM.split(" "):
        yield word + " "
        time.sleep(0.1)

# Get relative path
img_path = Path(__file__).parents[0]
# Load images
logo_img = Image.open(f"/{img_path}/../Images/RRR.png")

# Set the page title and icon and set layout to "wide" to minimise margins
st.set_page_config(page_title="RRR", page_icon=":globe_with_meridians:")

def main():
    # Create columns
    head_l, head_r = st.columns((3.5, 1))
    with head_l:
        st.title("The Rust & Ruin Registry")
        st.subheader("Knowledge Base")
    with head_r:
        # Add logo
        st.image(logo_img)

    call_sign = st.text_input("Enter callsign")
    if st.button("Verify Callsign"):
        with st.status("Verifying...", expanded=True) as status:
            st.write("Connecting to omni-net...")
            time.sleep(2)
            st.write("Bypassing IPS-N Authentication Protocols...")
            time.sleep(1)
            st.write("Decrypting Union Credentials...")
            time.sleep(1)
            st.write("Duplicating SSC Validation Certificate...")
            time.sleep(1)
            st.write("Scraping Lancer History...")
            time.sleep(1)
            st.write("Validating Callsign...")
            time.sleep(3)
            status.update(label="Callsign Verified!", state="complete", expanded=False)

        st.info(f"Restricted Access Granted. Welcome {call_sign} to The Rust & Ruin Registry")
        st.write_stream(stream_data)

        st.warning("ADVISORY: This archive has been updated following the SSC Occupation of 5016u. Records predating the occupation are retained for context and flagged accordingly.")

        # ---------------- Planetary Overview ----------------
        st.header("Planetary Overview")
        with st.expander("Overview"):
            st.info("The below review is from an intercepted transmission to a Harrison Armory ship Captain. We feel it aptly sums up the state of the planet.")
            st.markdown(
                "Perched at the very edges of union space, Gotia VII isn't a planet; it's a furnace. "
                "Its ochre skies are perpetually choked with smog, a bilious yellow that bleeds into the twin suns' harsh glare. "
                "Continent-spanning factories sprawl like rusted leviathans, their smokestacks spewing plumes that blacken the land for miles. "
                "This is no cradle of life; it's an industrial monument, carved from raw potential and driven to the brink by insatiable hunger."
            )
        with st.expander("Themes"):
            st.markdown(
                "- **Abundance and Depletion:** Gotia VII boasts a ludicrous wealth of resources. Mountains groan with veins of gleaming ore, rivers teem with energy-rich isotopes and the very ground shimmers with geothermal heat. This abundance is a curse. Entire ecosystems have been devoured to feed the insatiable maw of industry. Lush forests are memories, replaced by slag heaps and skeletal refineries. The once-vibrant bioluminescent flora has been choked out by pollution, leaving only a sickly glow on the undersides of rusted pipes.\n"
                "- **The Toiling Masses:** The people of Gotia VII are as much a part of the industrial landscape as the factories themselves. Generations hunched over vats and forge fires have left their mark. They are a grim, soot-stained race, their bodies hardened by labour and their lungs ravaged by the ever-present fumes. Their lives are measured in shifts and quotas, their only solace is the fleeting warmth of communal fires and the potent fumes of locally distilled industrial spirits.\n"
                "- **Planet on the Brink:** The relentless exploitation has taken its toll. The planet's core simmers precariously, tremors wracking the surface with increasing frequency. Resource scarcity looms on the horizon, a specter that haunts the industrial elite who huddle in sky-high arcologies, far from the choking fumes below. Gotia VII teeters on a precipice, a testament to unchecked greed and a stark warning of what unchecked industrial hunger can bring."
            )
            st.info("Agent Voss has noted that one of the largest assets and risks on any mission are the planet's populus. Ensure you utilise them, but do not underestimate them.")
        st.write("---")

        # ---------------- Key Players ----------------
        st.header("Key Players")
        with st.expander("The Machiavelli Corporation"):
            st.markdown(
                "The original architects of Gotia VII's industrial sprawl and first settlers of the planet, arrived aboard the 7th of The Ten, the *Corliss*. "
                "Ten thousand years of industrial dominion have not been undone by a single kinetic strike. "
                "CEO Victor Dominic still rules from a fortified arcology in the planet's equatorial forge-belt, and Machiavelli's refineries, forge-chains, and private security divisions remain the single largest industrial force on Gotia VII. "
                "Dominic has declared SSC's receivership an act of corporate piracy and is resisting the occupation with every resource he has, not for the workers dying in the trenches, but because Machiavelli does not yield its assets to anyone."
            )
        with st.expander("IPS-Northstar"):
            st.info("Assembled from Port Aeturnus dockside assets and IPS-N freight rate sheets leaked by a disgruntled purser.")
            st.markdown(
                "The iron fist in the velvet glove. These interplanetary shipping giants are the lifeblood of Gotia VII, ferrying colossal machinery and raw materials while exporting finished goods and refined resources. "
                "With the planet under occupation and an open insurgency burning through the lower levels, IPS-N has doubled down on its veneer of neutrality, charging all sides triple rates and profiting handsomely from a war neither side can fight without them."
            )
        with st.expander("Harrison Armory"):
            st.markdown(
                "Union's military arm, Harrison Armory represents a stark contrast to the grimy industrial landscape. "
                "Their gleaming warships still bristle in orbit, but the \"benevolent\" annexation they promised has been stolen from under them. "
                "Their leader, a stern and ambitious General Vargas, was blindsided by SSC's kinetic strike and has not left his flagship since. "
                "He still pushes for annexation, but now in a language of Union arbitration and \"stabilising intervention,\" waiting for SSC to overextend so the Armory can step in and finish the job."
            )
        with st.expander("Smith Shimano Corpro"):
            st.warning(f"Classification updated post-Occupation. Full intelligence access granted to {call_sign}.")
            st.markdown(
                "Once the enigma lurking aboard The Caduceus Station, SSC is now the occupying power of Gotia VII. "
                "Their clandestine biological research into Gotian genetic resilience is no longer clandestine: Dr. Anya Petrova, once a thorn in the side of Machiavelli and Union alike, now serves as Planetary Science Administrator, and her Gotian Resilience Paper has become the legal justification for the \"Emergency Scientific Receivership\" under which the planet is held. "
                "Beneath the scientific veneer, SSC is quietly excavating something far older and far stranger than a population study."
            )
        st.write("---")

        # ---------------- History ----------------
        st.header("History of Gotia VII")
        with st.expander("The Long Voyage & Founding (5007bu – 0bu)"):
            st.info("Compiled from Union archives, Machiavelli corporate records, and Hull-Keeper oral tradition. Dates approximate where records are incomplete.")
            st.markdown(
                "- **c. 5007bu** — The 7th ship of The Ten, *Corliss*, departs from Earth (later known as Cradle), carrying cryo-banked settlers and the industrial seed-libraries of a dozen Fall-era forge guilds.\n"
                "- **c. 4180bu** — *Corliss* makes planetfall on Gotia VII after an extended sublight transit. Surveyors catalogue the planet's ruinous atmosphere and its staggering mineral, isotopic, and geothermal wealth. The decision is made to stay.\n"
                "- **c. 4100bu** — *Corliss* is partially stripped to build **Foundry-Prime**, the first permanent settlement. The ship's reactor becomes the planet's first geothermal tap.\n"
                "- **c. 3700bu** — Deep-mine operations begin in earnest. Miner-families, bound to specific seams and shafts, form the social backbone of the young colony.\n"
                "- **c. 2500bu** — The Soot Generations begin. Atmospheric scrubbers fail or are cannibalised for industry; the population adapts, biologically and culturally, to the permanent smog.\n"
                "- **c. 500bu** — The Corliss Council, last unified governing body of the original settlers, dissolves. Power fragments between mining syndicates and forge-clans, chief among them **Forge-House Machiavelli** and its rival **Dominus Arc-Smelting**."
            )
        with st.expander("First & Second Committee (0u – 4596u) — The Ascent of Machiavelli"):
            st.info("Reconstructed from Machiavelli corporate archives; dates massaged by a thousand generations of in-house historians. Treat as directional.")
            st.markdown(
                "- **c. 900u** — News of Union's founding reaches Gotia VII via a passing trade vessel. The news is largely ignored; Gotia's forge-clans consider themselves sovereign.\n"
                "- **c. 1800u** — The **Great Vein Collapse** kills thousands in Dominus Arc-Smelting's flagship pit. A weakened Dominus is absorbed by Forge-House Machiavelli in the aftermath, consolidating Machiavelli's grip on the planet's heavy industry.\n"
                "- **c. 3000u** — Forge-House Machiavelli formally rebrands as **The Machiavelli Corporation**, adopting Second Committee corporate structures while remaining entirely outside Union oversight.\n"
                "- **c. 3900u** — **The Hollowing.** The last of Gotia VII's surface biosphere collapses. Remaining wild forests burn in uncontrolled slag-fires; bioluminescent flora vanish within a generation.\n"
                "- **c. 4400u** — Machiavelli unilaterally issues the **Ash Accords**, claiming all planetary mineral rights. Remaining independent miner-clans are crushed or absorbed. CEO lineage consolidates into the Dominic family."
            )
        with st.expander("Third Committee (4596u – 5016u) — Contact and Carve-up"):
            st.markdown(
                "- **4596u** — Third Committee reforms on Cradle. Union's gaze begins turning outward to long-lost colonies.\n"
                "- **4612u** — A Union long-range survey formally logs Gotia VII. Records reveal Machiavelli has operated outside Union oversight for millennia. Diplomatic overtures begin; Machiavelli stonewalls.\n"
                "- **4701u** — **IPS-Northstar** signs an exclusive freight contract with Machiavelli, establishing the first orbital logistics infrastructure and trade lanes. Gotian goods begin reaching Union markets.\n"
                "- **4850u** — **Harrison Armory** stations a \"peacekeeping detachment\" in orbit, citing Union strategic interests. Machiavelli publicly protests the presence while privately purchasing Armory ordnance.\n"
                "- **4955u** — **Smith Shimano Corpro** arrives aboard **The Caduceus Station**, citing humanitarian bio-research into Gotian physiological resilience. In truth, SSC is already quietly cataloguing paracausal anomalies flagged by earlier Union surveys.\n"
                "- **5007u** — **General Vargas** takes command of Harrison Armory's Gotia detachment and begins formally lobbying Union for annexation under martial stabilisation.\n"
                "- **5012u** — **Dr. Anya Petrova** publishes the Gotian Resilience Paper, drawing Union scientific attention and grant funding. The paper serves as cover for SSC's deeper paracausal research programme."
            )
        with st.expander("The Registry's Ledger (5016u)"):
            st.info("Contracts run by Rust & Ruin Registry lancers through Crowbar Jones.")
            st.markdown(
                "- **5016u (early)** — **The Solitude Job.** A derelict IPS-Northstar freighter, *Solitude*, is boarded by Registry lancers on contract from Crowbar Jones. The \"lost cargo\" retrieved from its hold is revealed to be a paracausal gateway to a realm of cyclopean geometries and void-entities, a fact buried by those who commissioned the job.\n"
                "- **5016u** — **The Deep Trench Strike.** Miners at the Ironhusk Foundry take a Machiavelli base hostage demanding better wages and basic quality of life. Registry lancers, dispatched under Sgt Stoneboot, break the strike by force. Casualties are high; operations resume within the week.\n"
                "- **5016u** — **Vane's Sunken Vault.** Registry lancers infiltrate the fortified manor of Trade Baron Silas Vane and breach a hidden subterranean cavern beneath The Precipice. The \"Abominant\" guarding the vault is revealed to be a hyper-realistic hologram, raising unanswered questions about what Vane was truly concealing.\n"
                "- **5016u (present)** — **The Star-Vein Falls.** A paracausal Trans-Uranic Silicate meteorite impacts the Salt Flats. SSC and Machiavelli Corp mobilise on opposing sides of the Glass Crater. Geological tremors reach record frequency, resource scarcity looms, and four corporate powers stand locked in a cold war over a dying world, with the planet itself running out of time.\n"
                "- **5016u (late)** — **The SSC Occupation.** Following Sybil Vane's kinetic strike and the destruction of the Salt Flat colonies, Smith Shimano Corpro declares Gotia VII under \"Emergency Scientific Receivership.\" SSC heavy assets deploy planetside to protect \"Interstellar Interests.\" Machiavelli Corp, under a defiant Victor Dominic, declares open corporate war from its fortified equatorial arcology. Foreman Gravel Gault severs ties with Machiavelli in protest and defects to the Rust & Ruin Registry, bringing his insurgency contacts with him. The Rust & Ruin Registry is driven underground and becomes the reluctant backbone of a planetary resistance."
            )
        st.write("---")

        # ---------------- The Gotian People ----------------
        st.header("The Gotian People")
        with st.expander("Cultural Briefing"):
            st.info("Compiled from Registry field notes, Hull-Keeper testimony, and Dr. Petrova's Gotian Resilience Paper (5012u).")
            st.markdown(
                "The Gotians are the descendants of the *Corliss* settlers: Fall-era forge guilds, cryo-banked miners, and the industrial working class of a dying Cradle, pressed into the hull of a single ship and thawed onto the most hostile world any of them had ever seen. "
                "Ten thousand years of unbroken industrial labour have shaped them into something distinct from the spacer populations of Union's core worlds. "
                "They are short, broad, soot-stained, and slow to trust. They call themselves Gotian first and anything else a distant second."
            )

            st.subheader("Ancestry & Physiology")
            st.markdown(
                "The Soot Generations are not a metaphor. Centuries of breathing Gotia's particulate-thick air have produced real, heritable adaptations: denser alveolar tissue, elevated tolerance for heavy metal exposure, a distinctive grey-black pigmentation that develops within the first decade of life. "
                "Gotian children are born pale and darken as they grow. A full-blood Gotian can work shifts in atmospheres that would kill a spacer outright.\n\n"
                "The adaptation is incomplete. **Lung-rot**, a chronic degenerative condition caused by silicate accumulation, kills most deep-trench miners before their fiftieth year. "
                "Medicine exists but is expensive, and until recently only Machiavelli controlled the supply. It is the single most-cited grievance in Gravel Gault's Registry broadcasts.\n\n"
                "This is the resilience Dr. Anya Petrova's paper catalogued, and the reason SSC takes an unhealthy interest in Gotian blood."
            )
            st.warning("Lung-rot remains endemic despite physiological adaptation. Medicine exists, Machiavelli controls supply, and the price of a vial is the single most-cited grievance in Registry broadcasts.")

            st.subheader("Clan & Kin")
            st.markdown(
                "Gotian society is organised around the **forge-clan** and the **seam-family**, two overlapping structures inherited from the original Corliss Council era. "
                "A forge-clan ties a lineage to a specific industrial process: smelters, cutters, drillers, refiners. "
                "A seam-family ties a lineage to a specific mine, shaft, or vein. "
                "A Gotian introduces themselves by both: *\"Halder, of Forge Iron-Blood, Seam Deepcut-Nine.\"*\n\n"
                "The Machiavelli Corporation spent centuries trying to dissolve these structures in favour of corporate employment numbers. "
                "It never fully took. Even today, a Machiavelli payroll ID is treated as a polite fiction laid over the real affiliations."
            )

            st.subheader("Faith & Custom")
            st.markdown(
                "Gotians are not a religious people in the Union sense. What they have instead is **The Long Shift**, a shared fatalistic philosophy that frames life as a single unbroken labour rota, with death as \"clocking out.\" "
                "Communal fires, industrial spirits, and the ritual of the shift-change bell carry most of the weight that faith might elsewhere. "
                "The oldest Gotian prayer, muttered before a deep descent, translates roughly as: *\"Keep the roof up. Keep the lamp lit. Bring me back up.\"*\n\n"
                "A small but growing minority venerate the *Corliss* itself, whose reactor still powers Foundry-Prime. "
                "These **Hull-Keepers** treat the original ship as an ancestor-spirit and maintain shrines in its old passageways."
            )

            st.subheader("Attitudes Toward the Corps")
            st.markdown(
                "- **Machiavelli:** A bad parent. Abusive, exploitative, but theirs. Gotians resent Machiavelli but bristle when outsiders criticise it.\n"
                "- **SSC:** Tourists with scalpels. Trusted by no one. The occupation has hardened a pre-existing contempt into open hatred.\n"
                "- **IPS-N:** Useful strangers. Gotians respect that IPS-N brings things in and takes things out without pretending to care about the people in between.\n"
                "- **Harrison Armory:** Bigger tourists. Armory personnel are mocked for their clean uniforms and filtered air, and universally assumed to be on the verge of shooting someone.\n"
                "- **The Registry:** Ours. Crowbar Jones is a folk hero, whether he wants to be or not."
            )
        st.write("---")

        # ---------------- Geography & Regions ----------------
        st.header("Geography & Regions")
        with st.expander("The Blueprint Map"):
            st.info("Synthesised from Union long-range survey telemetry and a century of Registry overflight runs. The only honest map of Gotia VII in existence.")
            st.markdown(
                "The map of Gotia VII is a blueprint, not an atlas. Forget countries and continents; this is a world transformed into a singular, grinding machine. "
                "From the equator's perpetual smog chokehold to the ice caps stripped bare by mining claws, industry dominates every inch. "
                "Sprawling factory complexes, dwarfing any pre-unification nation, sprawl across the landscape, their tendrils reaching out like insatiable metal worms to devour the last vestiges of raw materials. "
                "Resource zones, not national borders, mark the territories of the megacorporations.\n\n"
                "Ten thousand years of sliced-and-diced industrial carve-up have left only a handful of regions with any real identity, and most of that identity is \"which corporation owns the hole in the ground.\" "
                "What follows is not a comprehensive geography; it is the six places that still matter in 5016u."
            )
        with st.expander("The Equatorial Forge-Belt"):
            st.markdown(
                "A continent-spanning band of refineries, forge-chains, and fortified arcologies straddling Gotia VII's equator. "
                "The air here is so saturated with heavy-metal particulate that unfiltered mechs suffer sensor degradation within hours. "
                "The Forge-Belt is Machiavelli's heartland and always has been: this is where the original Forge-House established itself after the Great Vein Collapse, and where the corporation's productive spine still lives.\n\n"
                "The Belt's crown jewel is **Nuova Firenze**, Victor Dominic's personal city-state and the most modern urban centre on the planet. "
                "Under the occupation, the entire Forge-Belt has become the largest zone of open defiance on Gotia VII."
            )
        with st.expander("The Great Pit"):
            st.info("Survey data cross-referenced with Registry service-tunnel maps maintained by Crowbar Jones.")
            st.markdown(
                "A monstrous open-pit mine in Gotia VII's northern hemisphere, the largest single excavation on the planet. "
                "The Pit has been chewed into the crust for over seven thousand years and now descends more than three kilometres. "
                "The city of **The Precipice** clings to its cliff face. "
                "Beneath its floor, an abandoned network of service tunnels hides the Rust & Ruin Registry's underground command."
            )
        with st.expander("The Deep Trenches"):
            st.markdown(
                "South of the Forge-Belt, the continental crust splits into a network of vast tectonic trenches, some descending more than ten kilometres into the planetary crust. "
                "This is where the richest paracausal-adjacent ores are extracted, and where Gotia VII kills the most of its own. "
                "Lung-rot rates in the Trench workforce are the highest on the planet; lifespan expectancies are measured in shifts, not years.\n\n"
                "The trench-city of **Ironhusk** sits at the lip of the largest trench, anchored by the Ironhusk Foundry."
            )
        with st.expander("The Glassed Salt Flats"):
            st.error("EXCLUSION ZONE. Active SSC research presence. Do not enter without Registry authorisation.")
            st.markdown(
                "Once a broad salt plain peppered with independent mining colonies, now a radiological exclusion zone. "
                "SSC's Silk Road Protocol kinetic strike vaporised the Glass Crater, the Star-Vein meteorite, and every colony within a hundred kilometres. "
                "What remains is a featureless plain of fused glass, faintly violet under the smog, studded with the wreckage of the corporate mechs that fought here.\n\n"
                "SSC claims the zone is irradiated and off-limits to all non-research personnel. "
                "The truth is that the subterranean data-conduit Sybil Vane died to protect still lies somewhere beneath the glass, and SSC's excavation teams are working around the clock to reach it before anyone else does."
            )
        with st.expander("The Cradlelands"):
            st.markdown(
                "The oldest settled region on Gotia VII, and the only one that approaches anything like historical significance. "
                "The *Corliss* landed here, and its partially-stripped hull still anchors the regional geothermal grid. "
                "The Cradlelands hold the highest concentration of Hull-Keeper shrines and the oldest continuously operating forge-clans on the planet. "
                "At their heart sits **Foundry-Prime**, the first permanent settlement.\n\n"
                "Industrially, the Cradlelands are a backwater: the easy veins were exhausted five thousand years ago. "
                "What remains is a region of cultural weight, and a rare pocket of the planet where a Gotian can still hear themselves think."
            )
        with st.expander("The Polar Scrapfields"):
            st.info("Compiled from Cairnfrost salvage manifests and a single weather-station telemetry feed that has been running uninterrupted since the Second Committee.")
            st.markdown(
                "The northern ice cap, stripped to bedrock by centuries of cryogenic mining. "
                "The Scrapfields are where obsolete ships, decommissioned mining rigs, and industrial waste are dumped to freeze and slowly disintegrate. "
                "A single city, **Cairnfrost**, survives at the southern edge of the fields, scraping a living from reclamation and scrap reprocessing. "
                "The Polar Scrapfields are the closest thing Gotia VII has to wilderness, and still not close at all."
            )
        with st.expander("Orbit: The Caduceus Ring"):
            st.markdown(
                "Gotia VII's orbital belt is a crowded, contested layer of stations, freighters, and warships. "
                "**Caduceus Station** sits at its heart: originally Smith Shimano Corpro's orbital research facility, now the de facto capital of the occupation. "
                "**Port Aeturnus**, the planet's primary IPS-N groundside spaceport, is the Ring's anchor to the surface. "
                "Harrison Armory's warships hold a higher orbit, watching. "
                "The derelict IPSN freighter *Solitude*, site of the Lost Cargo job, still drifts in a decaying orbit on the far side of the planet, a reminder that the Ring has been a graveyard for a long time."
            )
        st.write("---")

        # ---------------- Cities ----------------
        st.header("Cities")
        with st.expander("Nuova Firenze"):
            st.info("Recovered from a compromised Machiavelli tourism briefing intended for off-world corporate visitors.")
            st.markdown(
                "If The Precipice is what Gotia VII does to its workers, Nuova Firenze is what Gotia VII buys for its masters. "
                "A vertical supercity rising in a solid pillar of neon and polished ferrosteel from the heart of the Equatorial Forge-Belt, Nuova Firenze is the single most modern urban centre on the planet and, by several orders of magnitude, the most obscene. "
                "Holographic advertisements the size of cathedral windows paint the smog in pulsing amethyst and Machiavelli crimson. "
                "Sky-bridges vault between corporate towers at altitudes high enough to clear the worst of the particulate haze, and the uppermost tiers boast the only natural-blue sky a living Gotian is likely to see.\n\n"
                "At the apex of the city rises **The Dominion**, Victor Dominic's personal spire and the seat of the Machiavelli Corporation. "
                "From its uppermost levels, Dominic can see across hundreds of kilometres of his own refineries; from its lowest, his private security can see into every street, alley, and service duct of the city below. "
                "Surveillance drones are thicker than the smog. Biometric checkpoints gate every sky-bridge. "
                "The Dominion's private reactor, a fusion array salvaged and upgraded from a decommissioned Harrison Armory cruiser, powers the entire city and cannot be cut by any external actor.\n\n"
                "Nuova Firenze's population stratifies cleanly with elevation. "
                "The upper tiers are the playground of Machiavelli executives, aesthetic surgeons, holo-fashion houses, and black-market chop-shops offering illegal augmentations imported via IPS-N backchannels. "
                "The middle tiers house the corporate middle class: accountants, enforcers, engineers, and the tens of thousands of administrative personnel who keep Machiavelli's books balanced. "
                "The lower tiers, crusted at the base of the pillar like barnacles, house the servant caste: drivers, fabricators, cooks, and the domestic staff who keep the city running. "
                "Many of them have never seen the sky their employers enjoy.\n\n"
                "The city's culture is an aggressive, neon-drenched fusion of Machiavelli tradition and post-industrial excess. "
                "Neo-Florentine opera plays in the upper tiers; underground circuit fights run in the sublevels. "
                "The local fashion trend among executive youth is \"slag-chic,\" imitating the scarred, soot-stained look of trench workers their parents would never meet. "
                "The irony is apparently lost on them.\n\n"
                "Under the occupation, Nuova Firenze has become the most fortified city on Gotia VII. "
                "Automated defence platforms ring the spire, Machiavelli private security patrols every access route, and the lower tiers have been effectively militarised. "
                "SSC probes the perimeter but has not, so far, risked a direct strike. "
                "Dominic broadcasts his weekly ultimatums from The Dominion's apex, and the city's neon never dims."
            )
            st.warning("Access to this record has been upgraded due to the city's current strategic significance. Registry infiltration options are limited; all named assets in the spire are considered burned.")
        with st.expander("The Precipice"):
            st.info("A large-scale leak of IPS-N ships logs by a hacker believed to be associated with Horus contained the following account of a brief layover in The Precipice.")
            st.markdown(
                "The Precipice isn't so much a city as it is a precarious collection of dwellings clinging to the sheer cliff face of a colossal open-pit mine. "
                "Gazing down from the rusted walkways that serve as streets, the dizzying depth reveals a monstrous scar in the earth. "
                "Mining drills chew away at the rock face, spewing plumes of dust that perpetually hang over the city like a shroud.\n\n"
                "Life in the Precipice is a constant dance with danger. Rockfalls are a daily occurrence, the ground trembling with every blast and tremor. "
                "The air is thick with dust and the acrid tang of exhaust fumes. "
                "Sunlight, a rare visitor, struggles to penetrate the smog, bathing the city in a perpetual twilight.\n\n"
                "The Precipice exists solely to serve the mine below. Its inhabitants are the miners, their families, and the handful of support staff who keep the city functioning. "
                "Homes are built from salvaged scrap metal and scavenged materials, a testament to the resourcefulness of its residents. "
                "Narrow, twisting staircases connect the different levels, clinging precariously to the cliff face.\n\n"
                "The Precipice is a place of stark social divisions. The wealthy mine executives reside in a fortified enclave at the city's highest point, enjoying a semblance of luxury amidst the grime. "
                "Below them, the miners and their families struggle to survive in cramped, overcrowded quarters.\n\n"
                "Despite the harshness of their existence, a spirit of resilience burns bright in the Precipice. "
                "Some residents dream of escape, longing for a life beyond the shadow of the mine. "
                "Others, hardened by years of toil, find a grim satisfaction in their work, knowing they are contributing to the prosperity of the corporation (or at least, to their own meager wages). "
                "The Precipice is a city of contrasts, a place where hope and despair walk hand in hand, forever teetering on the brink.\n\n"
                "Under the occupation, Vane Manor at the city's highest ledge has been seized by SSC and converted into a regional command post. "
                "The abandoned service tunnels beneath the pit hide Crowbar Jones's Drilling Rig and the underground heart of the Rust & Ruin Registry."
            )
        with st.expander("Foundry-Prime"):
            st.info("Extract from a Union cultural-heritage survey filed by an academic currently believed to be in SSC custody.")
            st.markdown(
                "Foundry-Prime is the oldest continuously inhabited settlement on Gotia VII, and it feels every one of its ten thousand years. "
                "The city is built in rough concentric rings around the partially-stripped hull of the *Corliss*, which still lies half-buried where it made planetfall. "
                "The ship's spine forms the central thoroughfare, its reactor chambers are now civic power substations, and its crew quarters were long ago converted into the homes of the first forge-clans. "
                "Walking Foundry-Prime is walking the skeleton of humanity's arrival on this world.\n\n"
                "Architecturally, Foundry-Prime is a geological stratigraphy of industrial ages. "
                "The lowest layers are pre-Union: heavy, riveted, built when the settlers still expected the planet to kill them. "
                "Above them, First Committee ironwork. Above that, Second Committee concrete. "
                "Above that, the half-hearted Third Committee retrofits that never quite took. "
                "Nothing has been torn down in five thousand years; everything has simply been built on top of.\n\n"
                "The city is the spiritual centre of the Hull-Keeper movement. "
                "Shrines to the *Corliss* dot every district, ranging from small household altars to the Grand Reactor Chapel, where the original fusion core still burns and is tended by robed engineer-priests. "
                "The Hull-Keepers are not a large faith, but in Foundry-Prime they are the cultural majority, and the local dialect has absorbed their vocabulary: calendars are counted in \"hulls\" (ship-years since landing), and a common blessing is *\"may your rivets hold.\"*\n\n"
                "Economically, Foundry-Prime is a backwater. The original veins were exhausted millennia ago, and Machiavelli keeps only a token corporate presence here. "
                "The remaining economy runs on cultural tourism from off-world Union historians, small-scale artisanal forging (the Foundry-Prime clans still turn out the finest hand-forged tools on the planet), and remittances from Cradlelander families working abroad.\n\n"
                "Under the occupation, Foundry-Prime has been largely ignored. "
                "SSC judged it strategically irrelevant; Machiavelli has no garrison here worth mentioning. "
                "This has made it, by accident, one of the safest cities on Gotia VII, and the Registry has quietly begun funnelling refugees from the Salt Flats here through IPS-N back-channels."
            )
        with st.expander("Ironhusk"):
            st.info("Registry field report filed post-Quell Unrest. Author: senior Registry analyst.")
            st.markdown(
                "Ironhusk is the trench-city, and the trench-city is Ironhusk. "
                "A sprawling industrial town built into the upper fifty metres of the largest tectonic trench on Gotia VII, Ironhusk exists for one reason: to service the foundry and the shafts descending into the earth beneath it. "
                "The city is almost entirely vertical, carved into the trench wall itself, with the **Ironhusk Foundry**, a cathedral-sized smelting complex, anchoring the rim.\n\n"
                "Life in Ironhusk is defined by the descent. Every morning, shift-cages carry thousands of miners down into the trench for twelve-hour rotations; every evening, the cages bring back the living, the wounded, and the dead. "
                "Lung-rot is endemic. The city's medical infrastructure is primitive, and its single corporate clinic rations treatment according to Machiavelli productivity metrics. "
                "Gotians born in Ironhusk typically die in Ironhusk.\n\n"
                "The city's culture is brutally utilitarian. Entertainment consists of trench-fighting circles (human, not mech), communal fires fuelled by foundry slag, and the industrial spirits brewed in hundreds of unlicensed basement stills. "
                "Ironhuskers distrust outsiders, distrust their own foremen, and distrust each other; trust is extended only within the seam-family, and only after decades.\n\n"
                "The city is nominally governed by the Foundry overseer, **Sgt Stoneboot**, a veteran Machiavelli enforcer who crushed the Quell Unrest strike earlier in 5016u. "
                "Stoneboot's authority is absolute in the Foundry itself, considerably less absolute in the slums clinging to the trench wall, and rapidly eroding everywhere else. "
                "Since Gault's defection to the Registry, Ironhusk miners have quietly begun pirating Registry broadcasts, and Stoneboot has tripled his enforcer patrols without visibly slowing the trend.\n\n"
                "Under the occupation, Ironhusk has become a pressure cooker. "
                "SSC wants the trench ores. Machiavelli refuses to cede them. The miners want the foundry to stop eating their lungs. "
                "Whoever triggers the next Ironhusk strike will have a war on their hands, and nobody in Ironhusk is confident Stoneboot can prevent it."
            )
            st.warning("Intelligence priority: Registry analysis suggests Ironhusk is the most likely site of the next planetary flashpoint. Field assets should be pre-positioned.")
        with st.expander("Port Aeturnus"):
            st.info("Compiled from IPS-N dock manifests, Registry dockside assets, and intercepted SSC customs traffic.")
            st.markdown(
                "Port Aeturnus is the front door of Gotia VII, and has been since IPS-Northstar signed its first contract with Machiavelli in 4701u. "
                "Built on a broad coastal plain at the eastern edge of the Forge-Belt, Port Aeturnus is the planet's primary groundside spaceport: a sprawling complex of landing cradles, cargo yards, fuel depots, and bonded warehouses that handles more interstellar freight than every other Gotian port combined. "
                "The skyline is dominated by the **Aeturnus Stack**, IPS-N's corporate tower, and by the thick white plumes of cargo shuttles rising to the Caduceus Ring every few minutes.\n\n"
                "Unlike the rest of Gotia VII, Port Aeturnus is cosmopolitan. "
                "IPS-N crews rotate through from across Union space, bringing news, goods, and off-world fashions that trickle inland through smugglers and black-market brokers. "
                "The city's bars, bonded districts, and freight-yards host a constant churn of spacers, lancers, registered contractors, and Registry stringers looking for off-world work. "
                "Crowbar Jones still has a network here despite the occupation.\n\n"
                "Socially, Port Aeturnus is a layered negotiation. "
                "IPS-N runs the spaceport and its bonded zones under corporate authority. "
                "Machiavelli claims legal jurisdiction over the city as a whole and maintains a polite-but-permanent security presence. "
                "SSC now holds the customs office, courtesy of the occupation, and routinely searches inbound freight for insurgent materiel. "
                "Port Aeturnus functions only because none of these three actors has yet decided that seizing the city is worth the trade disruption.\n\n"
                "The city's underworld is the most sophisticated on Gotia VII. "
                "Paracausal contraband, off-world augmentations, Registry ordnance, and SSC research samples all move through Port Aeturnus, routed through a shifting network of dockside fixers, bonded-warehouse smugglers, and IPS-N freighter captains willing to look the other way for the right number. "
                "It is, not coincidentally, the easiest city to leave Gotia VII from, and the hardest to stay in without falling afoul of at least one of the three authorities.\n\n"
                "Under the occupation, Port Aeturnus has become the most strategically important city on the planet. "
                "SSC needs it to import occupation materiel. Machiavelli needs it to export forge-belt goods. "
                "The Registry needs it to smuggle weapons. IPS-N is charging everyone triple and smiling."
            )
            st.success("Registry safe-house network in Port Aeturnus is currently operational. Contact your handler for current drop coordinates.")
        with st.expander("Cairnfrost"):
            st.info("Fragmentary reports from the Registry's sole Cairnfrost liaison.")
            st.markdown(
                "Cairnfrost is the city at the end of the world, and the Gotians who live there would tell you that's an improvement. "
                "Built at the southern edge of the Polar Scrapfields, Cairnfrost is the last permanent settlement before the dead ice and dumped wreckage of the ruined north. "
                "The city is a warren of insulated habitation modules, reclaimed cargo containers, and repurposed ship-hulls lashed together and buried halfway into the permafrost for thermal protection. "
                "The temperature outside averages forty below.\n\n"
                "The city exists to process what Gotia VII has thrown away. "
                "Decommissioned mining rigs, obsolete freighters, industrial waste, and corporate slag are dumped in the Scrapfields and then, years later, reclaimed by Cairnfrost's salvage crews. "
                "The city's single industry is stripping this wreckage for rare metals, reactor cores, and salvageable tech, and shipping the yield south via IPS-N rail. "
                "Cairnfrost's economy is small, closed, and almost entirely off the books.\n\n"
                "Its people are correspondingly insular. "
                "Cairnfrosters are Gotians who couldn't or wouldn't stay elsewhere: deserters, defaulted miners, exiled forge-clan members, and a handful of genuine hermits who find the cold and the solitude preferable to the smog. "
                "The local dialect is almost unintelligible to mainland Gotians. "
                "Corporate presence is nominal: Machiavelli maintains a single tax office that has not been staffed in four years, and IPS-N runs a freight depot at the rail terminus.\n\n"
                "Cairnfrost has its own small Hull-Keeper chapter, centred on a reactor core salvaged from a Second Committee cruiser and installed as both the city's power source and its civic shrine. "
                "The locals call it **The Dim Hearth**. It is tended by a single engineer-priest and, according to local belief, is slowly dying.\n\n"
                "Under the occupation, Cairnfrost has gone quieter still. "
                "SSC has no interest in it. Machiavelli has no resources to spare for it. "
                "The Registry has a single liaison in the city, running a quiet smuggling route through the Scrapfields to move ordnance and refugees between the Cradlelands and the trenches. "
                "As far as Cairnfrost is concerned, the war might as well be happening on another planet."
            )
            st.warning("Registry smuggling route through the Scrapfields is currently active. Primary use: moving ordnance and refugees between the Cradlelands and the trenches.")
        with st.expander("Caduceus Station"):
            st.info("Compiled from Harrison Armory diplomatic observer reports and Registry orbital signals intelligence.")
            st.markdown(
                "Caduceus Station is the only city on Gotia VII that is not on Gotia VII. "
                "A ring-station in geostationary orbit over the Forge-Belt, Caduceus has served as Smith Shimano Corpro's orbital research facility since 4955u and, since the occupation, as the de facto capital of the SSC receivership. "
                "Its gleaming white-and-silver architecture is a deliberate aesthetic rebuke to the smog-stained industrial hellscape below; SSC personnel joke that they \"step off the shuttle, step into civilisation.\"\n\n"
                "The station is structured in three concentric rings. "
                "The outermost is commercial and diplomatic: shuttle docks, Union consular offices, trade delegations, and the station's single cosmopolitan thoroughfare, lined with high-end restaurants and couture boutiques catering to SSC's executive class. "
                "The middle ring houses SSC corporate administration, including Dr. Anya Petrova's office as Planetary Science Administrator. "
                "The innermost ring is classified: the biological research laboratories, the paracausal analysis wings, and, since late 5016u, the mission control centre coordinating the Glass Crater excavation.\n\n"
                "Caduceus's civilian population is small (a few thousand permanent residents, mostly SSC personnel and their families) but its transient population has swelled dramatically since the occupation. "
                "Harrison Armory has a permanent observer detachment. IPS-N runs a freight office. "
                "A handful of independent contractors, brokers, and Union officials rotate through on short-term billets. "
                "Nobody pretends the station is neutral, but everyone observes the fiction in public.\n\n"
                "The station's most conspicuous feature is the *Aethelgard*, the SSC orbital cruiser that fired the Silk Road kinetic strike, now permanently docked at Caduceus's military spine. "
                "The ship is both a weapon and a message: SSC's willingness to glass another Gotian city is visible from every window on the station and from every telescope on the planet below.\n\n"
                "Under the occupation, Caduceus has quietly become the most luxurious and best-protected place in the Gotia system, and the single most-hated address on the planet. "
                "Every Registry contract that passes through Crowbar Jones eventually circles back to it. Sooner or later, the Registry will try to hit it."
            )
            st.error(f"Full detail access denied to {call_sign}. Inner-ring schematics remain Priority-One clearance.")
        st.write("---")

        # ---------------- Political Climate ----------------
        st.header("Political Climate")
        st.warning(f"Access granted to {call_sign}. Information current as of late 5016u.")
        with st.expander("The Shape of the War"):
            st.info("Registry command briefing, circulated to all field handlers post-Occupation. Review before every contract.")
            st.markdown(
                "Gotia VII is no longer a contested planet; it is an occupied one. "
                "Smith Shimano Corpro's \"Emergency Scientific Receivership\" has shattered the old four-way cold war and replaced it with something far uglier: a single occupying corporate power, a planetwide insurgency, and two \"neutral\" parties quietly picking sides from the shadows. "
                "The Union nominally disapproves of the occupation but has yet to intervene."
            )
        with st.expander("Smith Shimano Corpro"):
            st.markdown(
                "**Status:** Occupying power. De facto planetary government.\n\n"
                "The Curators have dropped the pretence. "
                "The Caduceus Station has been reinforced with orbital assets, and SSC Constellation units now patrol the skies over The Precipice and the ruins of the Salt Flats. "
                "Vane Manor has been converted into a regional command post, and rumours suggest Sybil Vane's \"Silk Road Protocol\" research, the true reason for the kinetic strike, continues under a new handler codenamed **Curator Primus**.\n\n"
                "- **Priorities:** Securing the subterranean data-conduit under the Glass Crater; suppressing evidence of the kinetic strike's civilian toll; extracting as much paracausal silicate as possible before Union auditors arrive.\n"
                "- **Public face:** Dr. Anya Petrova, now Planetary Science Administrator. Her Gotian Resilience Paper has become the legal justification for the receivership, framing the occupation as a humanitarian protection of a fragile population.\n"
                "- **Weakness:** Overextended. SSC is a research and aesthetic-goods house, not a conquest corp. Their ground forces are elite but thin on the ground, and their supply lines depend on IPS-N."
            )
        with st.expander("The Machiavelli Corporation"):
            st.info("Assembled from intercepted Machiavelli private-security traffic and Gault's pre-defection intelligence dump.")
            st.markdown(
                "**Status:** Defiant. At corporate war with SSC.\n\n"
                "Victor Dominic's arcology held. Ten thousand years of paranoid overbuilding paid off in the opening hours of the occupation, and Machiavelli's equatorial forge-belt remains entirely under corporate control. "
                "Dominic has formally declared the receivership an act of corporate piracy and refuses every SSC summons. "
                "Machiavelli's private security divisions, spun up to wartime footing, now contest the skies over their own refineries; their forge-chains continue operating on a captive workforce that has nowhere else to go.\n\n"
                "Make no mistake: this is not a people's war. "
                "Dominic is not fighting for the miners dying of lung-rot in the lower seams. "
                "He is fighting because Machiavelli does not surrender its ledger to anyone, and because the silicate under the Glass Crater is worth more than most Union sector economies.\n\n"
                "- **Priorities:** Reassert exclusive control of all Gotian mineral rights. Recover or destroy the paracausal silicate before SSC can exploit it. Force Union arbitration on terms favourable to Machiavelli.\n"
                "- **Public face:** Victor Dominic, broadcasting weekly ultimatums from the arcology. His messaging frames the conflict as a legal dispute over mineral rights, not a war.\n"
                "- **Weakness:** The workforce. Generations of abuse mean the miners fight for Machiavelli only because SSC is worse. Any serious SSC overture to the trenches, or any Machiavelli production quota pushed too hard, could collapse the whole corporate war effort overnight."
            )
        with st.expander("IPS-Northstar"):
            st.markdown(
                "**Status:** Officially neutral. Quietly indispensable to both sides.\n\n"
                "IPS-N holds the only interstellar logistics network with meaningful capacity at Gotia VII, which means the occupation cannot function without them and the insurgency cannot import arms without them. "
                "Their line is that they move freight, not politics. "
                "In practice, they charge both sides triple rates and have quietly doubled their orbital presence under the pretext of \"ensuring contract security.\"\n\n"
                "- **Priorities:** Extend contracts with whoever is winning this week. Avoid formal alignment. Protect IPS-N ground staff and freighter crews in a hot warzone.\n"
                "- **Public face:** The IPS-N station chief maintains a ceremonial presence at Caduceus Station while running actual operations from a mobile command freighter in high orbit.\n"
                "- **Weakness:** Every freighter manifest is a potential casus belli. One intercepted shipment of Machiavelli ordnance and SSC would have grounds to revoke IPS-N's operating licence."
            )
        with st.expander("Harrison Armory"):
            st.info("Sourced from Armory bridge chatter, forwarded without comment by a sympathetic IPS-N comms officer.")
            st.markdown(
                "**Status:** Humiliated. Watching. Reassessing.\n\n"
                "The Armory's \"peacekeeping detachment\" was blindsided by the SSC kinetic strike. "
                "General Vargas's annexation play has been pre-empted by a rival corporation doing the annexing for him, without Union sanction, and the Armory was caught flat-footed in orbit. "
                "Vargas has not left his flagship in weeks. "
                "Armory warships still bristle above Gotia VII, but they have not fired a shot.\n\n"
                "- **Priorities:** Publicly: demand Union arbitration. Privately: wait for SSC to overextend, then step in as the \"stabilising force\" Vargas always wanted to be. Sell ordnance to Machiavelli through plausibly-deniable intermediaries in the meantime.\n"
                "- **Public face:** General Vargas, increasingly erratic, issuing statements demanding \"Union clarity\" that nobody at Central Committee seems willing to provide.\n"
                "- **Weakness:** Every week SSC consolidates, the Armory's window closes. If Vargas waits too long he ends up garrisoning an SSC protectorate instead of running the planet himself."
            )
        with st.expander("The Rust & Ruin Registry"):
            st.success("That's us. Welcome aboard.")
            st.markdown(
                "**Status:** Underground. The only faction fighting for Gotia VII itself.\n\n"
                "Not a corporation, and that is precisely the point. "
                "Crowbar Jones has moved the Registry off-grid, operating from his modified Drilling Rig and a network of abandoned service tunnels beneath The Precipice. "
                "The Registry now stands as the only organised power on Gotia VII that is not fighting for a balance sheet: SSC has its receivership, Machiavelli has its mineral rights, the Armory has its annexation dreams. "
                "The Registry has the miners, the seam-families, and anyone else the corps have decided is expendable.\n\n"
                "The most significant recent development is the defection of **Foreman \"Gravel\" Gault** from the Machiavelli Corporation. "
                "Disillusioned by Dominic's naked corporate opportunism during the occupation, Gault severed his ties, walked off his foreman post, and brought his insurgency contacts with him. "
                "He now operates out of Crowbar's rig as the Registry's ground commander, and the deep-trench miners who once answered to Machiavelli payroll answer to him. "
                "His presence has transformed the Registry from a mercenary clearinghouse into something closer to a revolutionary council.\n\n"
                "- **Priorities:** Keep lancers paid. Keep the miners armed. Break the occupation without letting Machiavelli simply reclaim the planet when it ends.\n"
                "- **Public face:** Crowbar Jones on the comms, Gravel Gault in the field.\n"
                "- **Weakness:** Wildly outgunned. One SSC breakthrough in the service tunnels, or one Machiavelli decision that the Registry has become a greater threat than SSC, and the whole resistance collapses."
            )
        with st.expander("Flashpoints to Watch"):
            st.warning("Registry command forecast. Revised fortnightly. Field assets pre-positioned against the listed scenarios as of the current issue.")
            st.markdown(
                "- Ironhusk: the next strike is coming. Gault is preparing.\n"
                "- The Glass Crater: SSC excavation toward the subterranean data-conduit is ongoing. Whatever they find may change the war.\n"
                "- Nuova Firenze: a direct SSC assault on The Dominion would formalise open war and force Union arbitration. Nobody wants it first, but somebody will trigger it.\n"
                "- Port Aeturnus: whoever controls the spaceport controls the off-world war economy. Currently a three-way standoff; unstable.\n"
                "- Caduceus Station: the Registry will eventually have to hit the station. The question is when and how."
            )
        st.write("---")

        # ---------------- Registry Dossier ----------------
        st.header("Registry Dossier")
        st.info("Compiled by the Rust & Ruin Registry for internal use. Update frequency: as circumstances permit. If you are reading this and you are not on the roster, you have already been logged.")
        st.markdown(
            "**Classification Key:**\n\n"
            "- **Priority One:** Immediate strategic targets. Removal or compromise materially changes the course of the occupation.\n"
            "- **Priority Two:** Watchlist. Not active targets, but track movement and intent.\n"
            "- **Assets & Allies:** Registry personnel, reliable contacts, and sympathetic third parties.\n"
            "- **Archived:** Deceased, incarcerated, or otherwise out of play. Retained for reference."
        )

        st.subheader("Priority One Targets")
        with st.expander("Victor Dominic"):
            st.error(f"Deep intelligence restricted. Summary granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** The Machiavelli Corporation\n"
                "- **Role:** CEO; effective dictator of the Equatorial Forge-Belt\n"
                "- **Known Details:** Descendant of the Dominic lineage that consolidated Machiavelli control during the Ash Accords (c. 4400u). Rules from **The Dominion** spire in Nuova Firenze. Ruthless autocrat. Controls production quotas, mineral rights, and a private security force of comparable size to Harrison Armory's Gotia detachment. Has publicly declared SSC's receivership an act of corporate piracy and refuses every Union summons.\n"
                "- **Registry Assessment:** Not our enemy this week. Do not mistake that for friendship. Dominic fights SSC for ledger reasons, not people reasons, and the moment he secures his mineral rights he will turn every Machiavelli asset on the trenches, on Gault personally, and on us. Treat him as the enemy of our enemy, and not one word more.\n"
                "- **Last Known Location:** The Dominion, Nuova Firenze. Has not been sighted outside the spire since the opening hours of the occupation."
            )
        with st.expander("Dr. Anya Petrova"):
            st.error(f"Deep intelligence restricted. Summary granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** Smith Shimano Corpro\n"
                "- **Role:** Planetary Science Administrator; de facto civilian governor of the occupation\n"
                "- **Known Details:** Published the Gotian Resilience Paper in 5012u, which the occupation now uses as its legal foundation. Runs the middle ring of Caduceus Station. Formally responsible for all research programmes, informally running cover for the Glass Crater excavation. Rumoured to maintain a second, classified research programme at Vane Manor; intelligence is thin.\n"
                "- **Registry Assessment:** More dangerous than she looks. Petrova is not a uniform with a rifle; she is the paperwork that makes the uniforms legal. Remove her and the receivership loses its Union-facing justification. A hard target, but a decisive one.\n"
                "- **Last Known Location:** Caduceus Station, middle ring executive offices."
            )
        with st.expander("Curator Primus"):
            st.error(f"Deep intelligence restricted. Summary granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** Smith Shimano Corpro, classified\n"
                "- **Role:** Unknown. Inherited Sybil Vane's Silk Road Protocol portfolio after her death\n"
                "- **Known Details:** Effectively nothing. Identity, species, and chain of command are all classified above the Registry's current intelligence reach. Handles the Glass Crater excavation and whatever paracausal research programme Vane died to protect. Communications to and from Caduceus Station show a distinctive Constellation encryption signature we have not yet cracked.\n"
                "- **Registry Assessment:** Ghost. Priority target by default: anyone SSC is this careful to hide is worth finding. Recommend Port Aeturnus signal-intercept detail be expanded until we have a face to this callsign.\n"
                "- **Last Known Location:** Unknown. Assumed Caduceus Station inner ring."
            )

        st.subheader("Priority Two Watchlist")
        with st.expander("General Vargas"):
            st.info("Dossier built from Armory press releases, intercepted flagship comms, and one lucky glimpse by a Registry steward working a Caduceus banquet.")
            st.markdown(
                "- **Affiliation:** Harrison Armory\n"
                "- **Role:** Commanding officer, Armory Gotia Detachment\n"
                "- **Known Details:** Spent the decade before the occupation lobbying Union for formal annexation under martial law. Publicly blindsided by SSC's kinetic strike. Has not left his flagship since the occupation began. Current public position: demanding Union arbitration. Current private position: waiting for SSC to overextend.\n"
                "- **Registry Assessment:** Vargas wants the planet for himself and cannot have it. That makes him useful. Every week SSC fails to consolidate, Vargas becomes a more viable back-channel for arbitration, ordnance supply, and late-war leverage. Do not trust him. Do not refuse his calls.\n"
                "- **Last Known Location:** HA flagship, high orbit."
            )
        with st.expander("Silas Vane"):
            st.markdown(
                "- **Affiliation:** Nominally independent; historically tied to SSC via Sybil Vane\n"
                "- **Role:** Trade Baron, The Precipice\n"
                "- **Known Details:** Paranoid magnate and hoarder of secrets. Owner of Vane Manor, perched on The Precipice's highest ledge. Manor was infiltrated and data vault breached during the Sunken Vault job earlier in 5016u; the subterranean \"Abominant\" guarding his hidden cavern was revealed to be a hyper-realistic hologram. Relationship to the late Sybil Vane is assumed to be familial but unconfirmed. Current status post-breach is unclear; he has not made a public appearance since.\n"
                "- **Registry Assessment:** Vane survived the breach. We know because the manor's subsequent takeover by SSC was bloodless, which suggests he cooperated. The hologram in the cavern indicates he was hiding something *from* SSC as much as from us. What was actually in that cavern, and what was the hologram meant to distract from, is the open question. Re-establish contact if possible.\n"
                "- **Last Known Location:** Vane Manor, now under SSC control. Personal whereabouts unconfirmed."
            )
        with st.expander("Sgt Stoneboot"):
            st.info("Profile compiled by Gault personally. Read accordingly.")
            st.markdown(
                "- **Affiliation:** The Machiavelli Corporation\n"
                "- **Role:** Foundry Overseer, Ironhusk\n"
                "- **Known Details:** Veteran Machiavelli enforcer. Broke the Quell Unrest deep-trench strike earlier in 5016u; official casualty figures were redacted, unofficial figures were catastrophic. Currently struggling to suppress growing miner sympathy for Registry broadcasts. Authority within the Foundry itself is absolute; authority in the slums clinging to the trench wall is not.\n"
                "- **Registry Assessment:** Stoneboot crushed Ironhusk's last strike because the miners had no coordination, no arms, and no external allies. None of those three things are still true. Recommend Gault make personal outreach: Stoneboot is a Machiavelli company man, but he is also a Gotian, and he has watched the foundry eat his own crews. Flip him, or remove him; either outcome opens the trench.\n"
                "- **Last Known Location:** Ironhusk Foundry, permanently on-site."
            )

        st.subheader("Assets & Allies")
        with st.expander("Crowbar Jones"):
            st.success(f"Internal record. Access granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** Rust & Ruin Registry\n"
                "- **Role:** Registry handler and coordinator; de facto Registry head\n"
                "- **Known Details:** Scarred brow, cybernetic eye. Operates from a modified Drilling Rig (Vehicle 009) hidden in abandoned service tunnels beneath The Precipice, reached via coded rendezvous. Prefers to brief via holographic projection rather than in person; identity of the man behind the hologram is carefully guarded even from senior Registry personnel. Broadcasts contract offers to trusted lancers through the Rusty Nail back-end. Folk hero in the trenches whether he wants to be or not.\n"
                "- **Registry Assessment:** He is the Registry. Keep him alive, keep him mobile, keep his rig running.\n"
                "- **Last Known Location:** The rig, somewhere. Ask less, move faster."
            )
        with st.expander("Foreman \"Gravel\" Gault"):
            st.success(f"Internal record. Access granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** Rust & Ruin Registry (defected from Machiavelli, 5016u)\n"
                "- **Role:** Registry ground commander; field lead for trench operations\n"
                "- **Known Details:** Gritty, cybernetic jaw that clicks when stressed. Smells of industrial grease and cheap tobacco. Formerly Machiavelli foreman with a secret revolutionary streak; maintained insurgency contacts under the Debt-Strike plan. Walked off his post and brought his contacts with him when Dominic's corporate-war rhetoric confirmed Machiavelli would never fight for the miners. Now runs field operations from Crowbar's rig. Trusted by the deep-trench workforce in a way no other figure on the planet currently is.\n"
                "- **Registry Assessment:** Essential. Gault is the bridge between a mercenary clearinghouse and an actual resistance. Treat as co-command with Crowbar on all trench-related matters.\n"
                "- **Last Known Location:** Crowbar's rig."
            )
        with st.expander("\"Iron-Rat\""):
            st.success(f"Internal record. Access granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** Independent insurgency cell; linked to Registry via Gault\n"
                "- **Role:** Insurgent contact, logistics and arms\n"
                "- **Known Details:** Gault's pre-Registry insurgency handle. Real identity is held only by Gault himself. Coordinates a loose network of miners, saboteurs, and forge-clan partisans operating beneath Machiavelli's notice since long before the occupation. Communications use miners' slang ciphers and are considered medium-encryption by SSC intelligence. Controls access to off-world ordnance shipments currently keeping the resistance armed.\n"
                "- **Registry Assessment:** Reliable while Gault vouches. If anything happens to Gault, Iron-Rat's network collapses or fragments within weeks. Contingency planning advised.\n"
                "- **Last Known Location:** Mobile. Active across the Deep Trenches and the Forge-Belt underground."
            )
        with st.expander("\"Sixer\""):
            st.success(f"Internal record. Access granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** The Rusty Nail\n"
                "- **Role:** Door security; Registry gatekeeper\n"
                "- **Known Details:** Gruff, scarred hand, cybernetic eye. Ignores pleas and bribes; admits only those who know the current password (recent rotation: *\"The Pit Never Sleeps\"*). Has worked the Rusty Nail door for longer than anyone currently in the Registry has been alive. Gotian by birth; seam-family affiliation unrecorded. Callsign \"Sixer\" is Registry shorthand; he has never confirmed a real name.\n"
                "- **Registry Assessment:** Loyal. Unshakeable. If he turns anyone away, respect the call.\n"
                "- **Last Known Location:** The Rusty Nail entry hatch, beneath the rickety fire escape."
            )
        with st.expander("The Bartender (\"One-Eye\")"):
            st.success(f"Internal record. Access granted to {call_sign}.")
            st.markdown(
                "- **Affiliation:** The Rusty Nail (technically)\n"
                "- **Role:** Holographic bartender; Registry information filter\n"
                "- **Known Details:** Sardonic NHP projection, presents as a gruff man with a missing eye-patch. Presides over the Rusty Nail bar and dispenses both questionable cocktails and, to trusted patrons, filtered Registry contract offers. NHP architecture is non-standard and predates the Rusty Nail by an unknown margin; Crowbar has never disclosed where the cascade came from or how it was stabilised. Knows more than it says. Says very little.\n"
                "- **Registry Assessment:** Trustworthy within scope. Do not attempt to interrogate beyond its contracted functions. One-Eye has a handler, and that handler is not you.\n"
                "- **Last Known Location:** The Rusty Nail bar. Projection footprint limited to the bar's holo-grid."
            )

        st.subheader("Archived")
        with st.expander("Executive Sybil Vane"):
            st.error("Deceased, 5016u. Retained for operational reference.")
            st.markdown(
                "- **Affiliation:** Smith Shimano Corpro\n"
                "- **Role:** Executive Contact, Gotia operations; architect of the Silk Road Protocol\n"
                "- **Status:** Deceased, 5016u (Turf War, Glass Crater)\n"
                "- **Known Details:** Cold, aristocratic. Spoke in metaphors of balance and purity; viewed Machiavelli personnel as \"industrial parasites.\" Piloted the SVXII Constellation-class mech. Died when Registry lancers chose Machiavelli's side at the Glass Crater and assaulted her position. Her last act was to trigger the kinetic strike from the orbital cruiser *Aethelgard*, glassing the Salt Flats and collapsing the subterranean data-conduit beneath.\n"
                "- **Registry Assessment:** Lesson retained: SSC executives will sooner destroy an asset than surrender it. Assume Curator Primus operates under identical protocols."
            )
        with st.expander("\"Scavenger Alpha\""):
            st.error("Presumed deceased, 5016u. Retained for operational reference.")
            st.markdown(
                "- **Affiliation:** The Vultures (independent raider cell)\n"
                "- **Role:** Pack leader, Salt Flats scavenger operation\n"
                "- **Status:** Presumed deceased, 5016u (Glassed Salt Flats)\n"
                "- **Known Details:** Coordinated a scavenger raid on the Star-Vein crater during the Turf War standoff. Transmitted on analog/burst encryption, low-security. Plan was to hit the crater's blind spot near the Crystalline Spires and extract violet silicate chips. Entire pack was in proximity to the kinetic strike impact zone at time of detonation.\n"
                "- **Registry Assessment:** Vulture cells regenerate. If another operation surfaces in the Scrapfields or the Cradlelands claiming Alpha's callsign, treat as a new cell under an inherited name, not a survivor."
            )
        st.write("---")

if __name__ == "__main__":
    main()
