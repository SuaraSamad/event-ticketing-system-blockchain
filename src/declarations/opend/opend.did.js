export const idlFactory = ({ IDL }) => {
  const Event = IDL.Record({
    'id' : IDL.Text,
    'owner' : IDL.Principal,
    'date' : IDL.Text,
    'name' : IDL.Text,
    'time' : IDL.Text,
    'description' : IDL.Text,
    'total_ticket' : IDL.Nat,
    'price' : IDL.Nat,
    'location' : IDL.Text,
  });
  return IDL.Service({
    'completePurchase' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'createEvent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Text],
        [],
      ),
    'generateTicketId' : IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Text], []),
    'getAllEvents' : IDL.Func([], [IDL.Vec(Event)], ['query']),
    'getEventsOwner' : IDL.Func([IDL.Text], [IDL.Principal], ['query']),
    'getListedEvents' : IDL.Func([], [IDL.Vec(Event)], ['query']),
    'getListedEventsPrice' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'getListedNFTPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getListedNFTs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getMyEvents' : IDL.Func([], [IDL.Vec(Event)], []),
    'getOpenDCanisterID' : IDL.Func([], [IDL.Principal], ['query']),
    'getOriginalOwner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getOwnedNFTs' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'isEventListed' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'isListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'listEvent' : IDL.Func([IDL.Text], [IDL.Text], []),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
    'newTicketOwner' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
