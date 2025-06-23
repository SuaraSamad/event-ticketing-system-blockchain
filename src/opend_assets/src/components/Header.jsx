import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Minter from "./Minter";
import Event from "./Event";
import Gallery from "./Gallery";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import MyEvent from "./MyEvent";

function Header() {
  const [userOwnedGallery, setOwnedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();
  const [eventOwnedGallery, setEventOwned] = useState();
  const [eventListingGallery, setEventListing] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);

  async function getNFTs() {
    // if (role === "collection") {
    //   // setLoaderHidden(false);
    //   const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    //   console.log(userNFTIds);
    //   setOwnedGallery(
    //     <Gallery title="My NFTs" ids={userNFTIds} role="collection" />
    //   );
    //   console.log(role);
    // }
    // setLoaderHidden(false);
    const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds);
    setOwnedGallery(
      <Gallery title="My NFTs" ids={userNFTIds} role="collection" />
    );

    const listedNFTIds = await opend.getListedNFTs();
    console.log(listedNFTIds);
    setListingGallery(
      <Gallery title="Discover" ids={listedNFTIds} role="discover" />
    );

    const listedEvents = await opend.getListedEvents();
    console.log(listedEvents);
    setEventListing(
      <Gallery
        title="Discover Events"
        ids={listedEvents}
        role="eventDiscover"
      />
    );

    // setLoaderHidden(false);
    const userEvents = await opend.getMyEvents();
    console.log(userEvents);
    setEventOwned(
      <Gallery title="My Events" ids={userEvents} role="myEvents" />
    );
    // setLoaderHidden(true);
  }

  useEffect(() => {
    getNFTs();
  }, []);

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discoverEvents">Discover Events</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/event">Create Event</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">My NFTs</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/myEvents">My Events</Link>
            </button>
          </div>
        </header>
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <Switch>
        <Route exact path="/">
          <img className="bottom-space" src={homeImage} />
        </Route>
        <Route path="/discover">{listingGallery}</Route>
        <Route path="/discoverEvents">{eventListingGallery}</Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/event">
          <Event />
        </Route>
        <Route path="/collection">{userOwnedGallery}</Route>
        <Route path="/myEvents">
          {eventOwnedGallery}
          {/* <MyEvent /> */}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
