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

        st.header("Planetary Overview")
        with st.expander("Review"):
            st.info("The below review is from an intercepted transmission to a Harrison Armory ship Captain. We feel it is aptly sums up the state of the planet")
            st.write("Perched at the very edges of union space, Gotia VII isn't a planet; it's a furnace. Its ochre skies are perpetually choked with smog, a bilious yellow that bleeds into the twin suns’ harsh glare. Continent-spanning factories sprawl like rusted leviathans, their smokestacks spewing plumes that blacken the land for miles. This is no cradle of life; it's an industrial monument, carved from raw potential and driven to the brink by insatiable hunger.")
        with st.expander("Key Findings"):
            st.subheader("Abundance and Depletion")
            st.write("Gotia VII boasts a ludicrous wealth of resources. Mountains groan with veins of gleaming ore, rivers teem with energy-rich isotopes and the very ground shimmers with geothermal heat. This abundance is a curse. Entire ecosystems have been devoured to feed the insatiable maw of industry. Lush forests are memories, replaced by slag heaps and skeletal refineries. The once-vibrant bioluminescent flora has been choked out by pollution, leaving only a sickly glow on the undersides of rusted pipes.")

            st.subheader("The Toiling Masses")
            st.info("Agent Voss has noted that one of the largest assests and risks on any mission are the planets populus. Ensure you utilise them, but do not underestimte them.")
            st.write("The people of Gotia VII are as much a part of the industrial landscape as the factories themselves. Generations hunched over vats and forge fires have left their mark. They are a grim, soot-stained race, their bodies hardened by labour and their lungs ravaged by the ever-present fumes. Their lives are measured in shifts and quotas, their only solace is the fleeting warmth of communal fires and the potent fumes of locally distilled industrial spirits.")

            st.subheader("Planet on the Brink")
            st.write("The relentless exploitation has taken its toll. The planet's core simmers precariously, tremors wracking the surface with increasing frequency. Resource scarcity looms on the horizon, a specter that haunts the industrial elite who huddle in sky-high arcologies, far from the choking fumes below. Gotia VII teeters on a precipice, a testament to unchecked greed and a stark warning of what unchecked industrial hunger can bring.")
        st.write("---")

        st.header("Major Players")
        with st.expander("The Machiavelli Corporation"):
            st.error(f"Full access to this record denied to {call_sign}.")
            st.info("Overview: The original architects of Gotia VII's industrial sprawl and first settlers of the planet arrived on an ancient interstellar vessel - one of The Ten, The Machiavelli Corporation is a titan with its iron claws firmly dug into the planet. Their ruthless CEO, Victor Dominic, rules with an iron fist, manipulating production quotas and controlling the flow of resources. He sees Union's arrival as a threat to his dominion and is fiercely resistant to any change in the status quo.")
        with st.expander("IPS-Northstar"):
            st.error(f"Full access to this record denied to {call_sign}.")
            st.info("Overview: The iron fist in the velvet glove. These interplanetary shipping giants are the lifeblood of Gotia VII, ferrying colossal machinery and raw materials while exporting finished goods and refined resources. They maintain a veneer of neutrality, profiting from the chaos while keeping a watchful eye on the political climate.")
        with st.expander("Harrison Armory"):
            st.error(f"Full access to this record denied to {call_sign}.")
            st.info("Overview: Union's military arm, Harrison Armory represents a stark contrast to the grimy industrial landscape. Gleaming warships bristle in orbit, a not-so-subtle reminder of Union's 'benevolent' interest in incorporating Gotia VII. Their leader, a stern and ambitious General Vargas, pushes for annexation, promising 'stability' through martial law.")
        with st.expander("Smith Shimano Corpro"):
            st.error(f"Full access to this record denied to {call_sign}.")
            st.info("Overview: Lurking in the shadows aboard The Caduceus Station, in planetary orbit, is the enigmatic Smith Shimano Corpro. Their primary interest seems less in resources and more in the people themselves. Rumours swirl about their clandestine biological research, whispers of attempting to unlock the genetic secrets behind the Gotians' remarkable resilience in the harsh environment. Dr. Anya Petrova, the enigmatic head of their research, is a constant thorn in the side of both The Machiavelli Corporation and Union.")
        st.write("---")

        st.header("Cities & Regions of Interest")
        with st.expander("The Precipice"):
            st.info("A large-scale leak of IPS-N ships logs by a hacker believed to be ascosiated with Horus contained the follow account of a brief layover in The Precipice")
            st.write("""
            The Precipice isn't so much a city as it is a precarious collection of dwellings clinging to the sheer cliff face of a colossal open-pit mine. Gazing down from the rusted walkways that serve as streets, the dizzying depth reveals a monstrous scar in the earth. Mining drills chew away at the rock face, spewing plumes of dust that perpetually hang over the city like a shroud.

            Life in the Precipice is a constant dance with danger. Rockfalls are a daily occurrence, the ground trembling with every blast and tremor. The air is thick with dust and the acrid tang of exhaust fumes. Sunlight, a rare visitor, struggles to penetrate the smog, bathing the city in a perpetual twilight.

            The Precipice exists solely to serve the mine below. Its inhabitants are the miners, their families, and the handful of support staff who keep the city functioning. Homes are built from salvaged scrap metal and scavenged materials, a testament to the resourcefulness of its residents. Narrow, twisting staircases connect the different levels, clinging precariously to the cliff face.

            The Precipice is a place of stark social divisions. The wealthy mine executives reside in a fortified enclave at the city's highest point, enjoying a semblance of luxury amidst the grime. Below them, the miners and their families struggle to survive in cramped, overcrowded quarters.

            Despite the harshness of their existence, a spirit of resilience burns bright in the Precipice. Some residents dream of escape, longing for a life beyond the shadow of the mine. Others, hardened by years of toil, find a grim satisfaction in their work, knowing they are contributing to the prosperity of the corporation (or at least, to their own meager wages). The Precipice is a city of contrasts, a place where hope and despair walk hand in hand, forever teetering on the brink.
            """)
        st.error(f"Further access to this record denied to {call_sign}.")
        st.write("---")

        st.header("Political Climate")
        st.error(f"Full access to this record denied to {call_sign}.")
        st.write("---")

if __name__ == "__main__":
    main()