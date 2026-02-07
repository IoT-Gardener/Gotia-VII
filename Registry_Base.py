import streamlit as st
import time
from pathlib import Path
from PIL import Image


_LOREM_IPSUM = """
This encrypted platform facilitates high-risk, high-reward operations for vetted freelancers. Discretion is paramount. Our network prioritizes deniability and anonymity. Triple R holds no liability for the legality or ethical implications of contracted operations. Due diligence is the responsibility of the independent contractor.
"""


def stream_data():
    for word in _LOREM_IPSUM.split(" "):
        yield word + " "
        time.sleep(0.1)


# Get relative path
img_path = Path(__file__).parents[0]
# Load images
logo_img = Image.open(f"{img_path}/Images/RRR.png")

# Set the page title and icon and set layout to "wide" to minimise margins
st.set_page_config(page_title="RRR", page_icon=":globe_with_meridians:")


def main():
    # Create columns
    head_l, head_r = st.columns((3.5, 1))
    with head_l:
        st.title("The Rust & Ruin Registry")
        st.subheader("Discretionary Operations for Qualified Freelancers")
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

        with st.expander("Turf War"):
            st.info(f"Mission Available to: {call_sign}")
            st.write("Mission Tags: Security, Surveillance.")
            st.write("Mission Brief: Maintain peace between conflicting SSC and Machiavelli Corporation corporate interests at the crash site of the 'Star-Vein' in Salt Flats.")
            st.write("Reward: 5000 credits.")
            st.success("Report to Crowbar Jones for full mission overview.")

        with st.expander("Machiavelli Data 'Retrival'"):
            st.error(f"Access Denied to: {call_sign}")
            st.write("Mission Brief: Redacted")
            st.write("Reward: Redacted")

        with st.expander("Vane's Sunken Vault"):
            st.success(f"Unavailable: Mission Complete")
            st.write("Mission Status: Trade Baron Vane's manor infiltrated. Vane's cavern breached and threat neutralised.")
            st.write("Rewarded: 10,000 credits")

        with st.expander("Quell Unrest"):
            st.success(f"Unavailable: Mission Complete")
            st.write("Mission Status: Unrest quelled, miner's compliant, casualties high. Full operation restored to deep trench mining operations.")
            st.write("Rewarded: 1500 credits")

        with st.expander("Lost Cargo"):
            st.success(f"Unavailable: Mission Complete")
            st.write("Mission Status: Lost cargo from IPS-Northstar freighter: Solitude, retrieved.")
            st.write("Rewarded: 3000 credits")

if __name__ == "__main__":
    main()