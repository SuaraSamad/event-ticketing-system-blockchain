import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import { Principal } from "@dfinity/principal";
import { opend } from "../../../declarations/opend";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";
import QRCode from "qrcode";

function Item(props) {
  // State variables for both events and NFTs
  const [eventButton, setEventButton] = useState();
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [nftPrincipal, setNFTPrincipal] = useState("");

  const id = props.id;
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });

  // TODO: When deploy live, remove the following line.
  agent.fetchRootKey();
  let NFTActor;
  let price; // Move price declaration to component level

  // Handle events
  if (props.role === "eventDiscover" || props.role === "myEvents") {
    const event = props.event;

    useEffect(() => {
      const fetchEventStatus = async () => {
        try {
          const eventIsListed = (await opend.isEventListed)
            ? await opend.isEventListed(event.id)
            : false;

          if (props.role === "eventDiscover" && eventIsListed) {
            setEventButton(<Button handleClick={() => handleEventBuy(event)} text={"Buy Ticket"} />);
          } else if (props.role === "myEvents" && !eventIsListed) {
            setEventButton(<Button handleClick={() => handleEventList(event)} text={"List Event"} />);
          }
        } catch (error) {
          console.error("Error fetching event status:", error);
        }
      };

      fetchEventStatus();
    }, [event.id, props.role]);

    async function generateQRCodeImage(data, size = 512) {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(data, {
          width: size,
          height: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          type: 'image/png',
          quality: 0.92,
          errorCorrectionLevel: 'M'
        });

        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const imageByteData = [...new Uint8Array(arrayBuffer)];

        return imageByteData;
      } catch (error) {
        console.error("Error generating QR code:", error);
        throw error;
      }
    }

    async function handleEventBuy(event) {
      console.log("Buying ticket for:", event.name);
      const name = event.name;
      let imageByteData;
      const timestamp = Date.now();
      const randomPart = parseInt(
        Math.random().toString(36).substring(2, 10),
        36
      );
      const ticketId = await opend.generateTicketId(
        event.id,
        timestamp,
        randomPart
      );
      const eventId = event.id;
      const owner = event.owner;
      const ticketBuyer = await opend.newTicketOwner();

      try {
        setLoaderHidden(false);
        const price = event.price;
        
        var qrCodeData = {
          ticketId: ticketId,
          eventId: eventId,
          ticketOwner: ticketBuyer,
          eventName: name,
          time: timestamp
        };
        
        const qrDataString = JSON.stringify(qrCodeData);
        imageByteData = await generateQRCodeImage(qrDataString);

        const newNFTID = await opend.mint(imageByteData, name);
        setNFTPrincipal(newNFTID);

        const transferResult = await opend.transferTicketOwnership(
          newNFTID,
          owner,
          ticketBuyer
        );
        
        setLoaderHidden(true);
        console.log("Ticket purchased successfully");
      } catch (error) {
        console.error("Error buying NFT:", error);
        setLoaderHidden(true);
      }
    }

    function handleEventList(event) {
      console.log("Listing event:", event.name);
      opend
        .listEvent(event.id)
        .then((result) => {
          console.log("Event listing result:", result);
          if (result === "Event listed successfully.") {
            setEventButton();
          }
        })
        .catch((error) => {
          console.error("Error listing event:", error);
        });
    }

    // Event card return with original styling
    return (
      <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
        <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
          <div className="event-header">
            <h3 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
              {event.name}
            </h3>
          </div>
          <div hidden={loaderHidden} className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="disCardContent-root">
            <div className="event-details">
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Description: {event.description}
              </p>
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Location: {event.location}
              </p>
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Date: {event.date}
              </p>
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Time: {event.time}
              </p>
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Available Tickets: {event.total_ticket.toString()}
              </p>
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Price: {event.price.toString()} ICP
              </p>
              <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
                Owner: {event.owner.toText()}
              </p>
            </div>
            {eventButton}
          </div>
        </div>
      </div>
    );
  }

  // Handle NFTs - using original loadNFT function
  async function loadNFT() {
    try {
      NFTActor = await Actor.createActor(idlFactory, {
        agent,
        canisterId: id,
      });

      const name = await NFTActor.getName();
      setName(name);
      const owner = await NFTActor.getOwner();
      setOwner(owner.toText());
      const imageData = await NFTActor.getAsset();
      const imageContent = new Uint8Array(imageData);
      const image = URL.createObjectURL(
        new Blob([imageContent.buffer], { type: "image/png" })
      );
      setImage(image);

      if (props.role == "collection") {
        const nftIsListed = await opend.isListed(props.id);
        if (nftIsListed) {
          setBlur({ filter: "blur(4px)" });
          setOwner("OpenD");
          setSellStatus("Listed");
        } else {
          setButton(<Button handleClick={handleSell} text={"Sell"} />);
        }
      } else if (props.role == "discover") {
        const originalOwner = await opend.getOriginalOwner(props.id);
        if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
          setButton(<Button handleClick={handleBuy} text={"Buy"} />);
        }

        const price = await opend.getListedNFTPrice(props.id);
        setPriceLabel(<PriceLabel sellPrice={price.toString() + " DANG"} />);
      }
    } catch (error) {
      console.error("Error loading NFT:", error);
    }
  }

  useEffect(() => {
    if (props.role !== "eventDiscover" && props.role !== "myEvents") {
      loadNFT();
    }
  }, [props.role]);

  function handleSell() {
    console.log("Sell button clicked");
    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    console.log("Sell item clicked = " + price);
    const listingResult = await opend.listItem(props.id, Number(price));
    console.log("Listing :" + listingResult);
    if (listingResult == "Success") {
      const openId = await opend.getOpendCanisterId();
      const transferResult = await NFTActor.transferOwnership(openId);
      console.log("Transfer result: " + transferResult);
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setSellStatus("Listed");
      }
    } else {
      console.log("Error listing item");
    }
  }

  async function handleBuy() {
    console.log("Buy button clicked");
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("wzp7w-lyaaa-aaaaa-aaara-cai"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const price = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, price);
    console.log("Transfer result: " + result);
    const transferResult = await opend.completePurchase(
      props.id,
      sellerId,
      CURRENT_USER_ID
    );
    console.log("Transfer result: " + transferResult);
    setLoaderHidden(true);
    setShouldDisplay(false);
  }

  // Return NFT JSX with original styling
  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;