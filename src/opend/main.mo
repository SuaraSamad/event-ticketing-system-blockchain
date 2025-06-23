import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import NFTActorClass "../nft/nft";
import Principal "mo:base/Principal";
import HashMap  "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Text "mo:base/Text";


actor OpenD {

    private type Listing = {
      itemOwner: Principal;
      itemPrice: Nat;
    };

    private type Event = {
      id: Text;
      owner: Principal;
      name: Text;
      description: Text;
      location: Text;
      date: Text;
      time: Text;
      total_ticket: Nat;
      price: Nat;
    };

    var eventCounter : Nat = 0;
    var ticketCounter : Nat = 0;

    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);
    var mapOfEvents = HashMap.HashMap<Text, Event>(1, Text.equal, Text.hash);
    var mapOfListedEvents = HashMap.HashMap<Text, Event>(1, Text.equal, Text.hash);

    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
      let owner : Principal = msg.caller;

      Debug.print(debug_show(Cycles.balance()));
      Cycles.add(100_500_000_000);
      let newNFT = await NFTActorClass.NFT(name, owner, imgData);
      Debug.print(debug_show(Cycles.balance()));

      let newNFTPrincipal = await newNFT.getCanisterId();

      mapOfNFTs.put(newNFTPrincipal, newNFT);
      addToOwnershipMap(owner, newNFTPrincipal);

      return newNFTPrincipal

    };

    public shared(msg) func createEvent(name: Text, description: Text, location: Text, date: Text, time: Text, total_ticket: Nat, price: Nat) : async Text {
      let owner : Principal = msg.caller;
      eventCounter += 1;
      let eventId = "event-" # Nat.toText(eventCounter);

      let newEvent : Event = {
        id = eventId;
        owner = owner;
        name = name;
        description = description;
        location = location;
        date = date;
        time = time;
        total_ticket = total_ticket;
        price = price;
      };

      mapOfEvents.put(eventId, newEvent);
      // mapOfEvents.put(owner, {
      //   id = eventId;
      //   owner = owner;
      //   name = name;
      //   description = description;
      //   location = location;
      //   date = date;
      //   time = time;
      //   total_ticket = total_ticket;
      //   price = price;
      // });

      Debug.print("Event created by: " # Principal.toText(owner));
      Debug.print("Event ID: " # eventId);
      Debug.print("Event Name: " # name);
      Debug.print("Event Description: " # description);
      return "success";
    };

    private func addToOwnershipMap(owner: Principal, nftId: Principal) {
        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
          case null List.nil<Principal>();
          case (?result) result;
        };

        ownedNFTs := List.push(nftId, ownedNFTs);
        mapOfOwners.put(owner, ownedNFTs);

    };

    public query func getOwnedNFTs(user: Principal) : async [Principal] {
      var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
        case null List.nil<Principal>();
        case (?result) result;
      };

      return List.toArray(userNFTs);
    };

    public query func getListedNFTs() : async [Principal] {
      let ids = Iter.toArray(mapOfListings.keys());
      return ids;
    };

    public shared(msg) func listItem(id: Principal, price: Nat) : async Text {
      var item : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
        case null return "NFT does not exist.";
        case (?result) result;
      };

      let owner = await item.getOwner();
      if (Principal.equal(owner, msg.caller)) {
        let newListing : Listing = {
          itemOwner = owner;
          itemPrice = price;
        };
        mapOfListings.put(id, newListing);
        return "Success";
      } else {
        return "You don't own the NFT."
      }
    };

    public query func getOpenDCanisterID() : async Principal {
      return Principal.fromActor(OpenD);
    };

    public query func isListed(id: Principal) : async Bool {
      if (mapOfListings.get(id) == null) {
        return false;
      } else{
        return true;
      }
    };

    public query func getOriginalOwner(id: Principal) : async Principal {
      var listing : Listing = switch (mapOfListings.get(id)) {
        case null return Principal.fromText("");
        case (?result) result;
      };

      return listing.itemOwner;
    };

    public query func getListedNFTPrice(id: Principal) : async Nat {
      var listing : Listing = switch (mapOfListings.get(id)) {
        case null return 0;
        case (?result) result;
      };

      return listing.itemPrice;

    };

    public query func getListedEventsPrice(eventId: Text) : async Nat {
      var event : Event = switch (mapOfListedEvents.get(eventId)) {
        case null return 0;
        case (?result) result;
      };

      return event.price;
    };

    public query func getEventsOwner(eventId: Text) : async Principal {
      var event : Event = switch (mapOfEvents.get(eventId)) {
        case null return Principal.fromText("");
        case (?result) result;
      };

      return event.owner;
    };

    public shared(msg) func completePurchase(id: Principal, ownerId: Principal, newOwnerId: Principal) : async Text {
      var purchasedNFT : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
        case null return "NFT does not exist";
        case (?result) result;
      };

      let transferResult = await purchasedNFT.transferOwnership(newOwnerId);
      if (transferResult == "Success") {
        mapOfListings.delete(id);
        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(ownerId)) {
          case null List.nil<Principal>();
          case (?result) result;
        };
        ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool {
          return listItemId != id;
        });

        addToOwnershipMap(newOwnerId, id);
        return "Success";
      } else {
        Debug.print("hello");
        return transferResult;
        
      }
    };

    public query func getAllEvents() : async [Event] {
      return Iter.toArray(mapOfEvents.vals());
    };

    public shared(msg) func getMyEvents() : async [Event] {
    let caller = msg.caller;
    let filteredEvents = Iter.toArray(
    Iter.filter(mapOfEvents.vals(), func(e: Event) : Bool {
      e.owner == caller
        })
      );
    return filteredEvents;
    };

    public shared(msg) func listEvent(eventId: Text) : async Text {
      var event : Event = switch (mapOfEvents.get(eventId)) {
        case null return "Event does not exist.";
        case (?result) result;
      };

      if (Principal.equal(event.owner, msg.caller)) {
        mapOfListedEvents.put(eventId, event);
        return "Event listed successfully.";
      } else {
        return "You are not the owner of this event.";
      }
    };

    public query func getListedEvents() : async [Event] {
      return Iter.toArray(mapOfListedEvents.vals());
    };

    public query func isEventListed(eventId: Text) : async Bool {
      if (mapOfListedEvents.get(eventId) == null) {
        return false;
      } else {
        return true;
      }
    };

    // public shared(msg) func completeEventPurchase(eventId: Text, buyer: Principal) : async Text {
    //   var event : Event = switch (mapOfListedEvents.get(eventId)) {
    //     case null return "Event does not exist.";
    //     case (?result) result;
    //   };
    //   var price : Nat = event.price;
    //   var owner : Principal = event.owner;
    //   var totalTickets : Nat = event.total_ticket;
    //   if (totalTickets > 0) {
        
    //   }
    // };
    public shared(msg) func transferTicketOwnership(id: Principal, ownerId: Principal, newOwnerId: Principal) : async Text {
      var purchasedNFT : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
        case null return "NFT does not exist";
        case (?result) result;
      };

      let transferResult = purchasedNFT.transferOwnership(newOwnerId);
      if (transferResult == "Success") {
        
      }
    };

    public shared(msg) func generateTicketId(eventId: Text, timestamp: Nat, randomPart: Nat) : async Text {
      let ticketOwner : Principal = msg.caller;
      let ticketId = eventId # "-" # Nat.toText(timestamp) # "-" # Nat.toText(randomPart) # "-" # Principal.toText(ticketOwner);
      return ticketId;
    };

    public shared(msg) func newTicketOwner() : async Principal {
      let tickekOwner : Principal = msg.caller;

      return tickekOwner;
    };

    // public query func getListedEvents() : async [Text] {
    //   let ids = Iter.toArray(mapOfListedEvents.keys());
    //   return ids;
    // };

    // public query func getListedNFTs() : async [Principal] {
    //   let ids = Iter.toArray(mapOfListings.keys());
    //   return ids;
    // };


};
