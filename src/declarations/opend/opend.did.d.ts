import type { Principal } from '@dfinity/principal';
export interface Event {
  'id' : string,
  'owner' : Principal,
  'date' : string,
  'name' : string,
  'time' : string,
  'description' : string,
  'total_ticket' : bigint,
  'price' : bigint,
  'location' : string,
}
export interface _SERVICE {
  'completePurchase' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
  'createEvent' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
      arg_4: string,
      arg_5: bigint,
      arg_6: bigint,
    ) => Promise<string>,
  'generateTicketId' : (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<
      string
    >,
  'getAllEvents' : () => Promise<Array<Event>>,
  'getEventsOwner' : (arg_0: string) => Promise<Principal>,
  'getListedEvents' : () => Promise<Array<Event>>,
  'getListedEventsPrice' : (arg_0: string) => Promise<bigint>,
  'getListedNFTPrice' : (arg_0: Principal) => Promise<bigint>,
  'getListedNFTs' : () => Promise<Array<Principal>>,
  'getMyEvents' : () => Promise<Array<Event>>,
  'getOpenDCanisterID' : () => Promise<Principal>,
  'getOriginalOwner' : (arg_0: Principal) => Promise<Principal>,
  'getOwnedNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'isEventListed' : (arg_0: string) => Promise<boolean>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listEvent' : (arg_0: string) => Promise<string>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
  'newTicketOwner' : () => Promise<Principal>,
}
