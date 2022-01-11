//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "./ERC721Standard.sol";

contract TicketNFT is ERC721Standard{

   struct Ticket {
        uint256 id;
        string venue;
        string eventTitle;
        uint256 price;
        string date;
        address  organiser;
        address  owner;
        TicketStatus status;
    }

    address private owner;
    enum TicketStatus {FOR_SALE, SOLD}
    Ticket[] private tickets;
    uint256 private pendingTicketCount;
    address[] private toBeApproved;
    uint256 private approvalcount;

    constructor(string memory _name, string memory _symbol) ERC721Standard(_name,_symbol) {
        owner = msg.sender;
    }

    function getapprovalcount() public view returns(uint256){
        return approvalcount;
    }
    function getpendingTicketCount() public view returns(uint256){
        return pendingTicketCount;
    }

    modifier exceptOrganizer() {
        require(!(owner==msg.sender), "This operation is not for Organizer");
        _; 
    }
    modifier onlyOrganizer() {
        require((owner==msg.sender), "Only Organizer can create tickets and approve requests");
        _; 
    }

    function requestapproval() public exceptOrganizer{
        toBeApproved.push(msg.sender);
        approvalcount++;
    }

    function approveall() public onlyOrganizer{
        for(uint8 i = 0; i < toBeApproved.length; i++){
            setApprovalForAll(toBeApproved[i], true);
        }
        approvalcount=0;
    }
    function createTickets(string memory _eventTitle, string memory _venue, string memory _date, uint256 _price ) public onlyOrganizer{
        require(bytes(_eventTitle).length > 0, 'The title cannot be empty');
        require(bytes(_venue).length > 0, 'The description cannot be empty');
        require(bytes(_date).length > 0, 'The date cannot be empty');
        require(_price > 0 , 'The price cannot be zero');
        
        Ticket memory _ticket = Ticket ({
            id : 0,
            eventTitle : _eventTitle,
            venue: _venue,
            price : _price,
            date : _date,
            organiser : msg.sender,
            owner :   msg.sender,
            status: TicketStatus.FOR_SALE
        });
        tickets.push(_ticket);
        uint256 _tokenId = tickets.length -1;
        uint _index = getTokenIndexByTokenID(_tokenId);
        tickets[_index].id = _index;
        mint(msg.sender, _tokenId,"test");
        pendingTicketCount++;
    }

    function buyTicket(uint256 _tokenId) payable public exceptOrganizer{
        //(_tokenId),"nonexistant token");
         uint _index = getTokenIndexByTokenID(_tokenId);
        //uint _index = _tokenId;
        Ticket memory _ticket = tickets[_index];
        require(msg.value >= _ticket.price, "Ticket price is more than supplied ether");
        require(msg.sender != address(0),"Zero address cannot buy");

        //refund    
        if (msg.value > _ticket.price) {
            payable (msg.sender).transfer(msg.value - _ticket.price);
        }
        payable (_ticket.owner).transfer(_ticket.price);
        transferFrom(_ticket.owner, msg.sender, _tokenId);
        tickets[_index].owner = msg.sender;
        tickets[_index].status = TicketStatus.SOLD;
        pendingTicketCount--;
    }

    function resellTicket(uint256 _tokenId, uint256 _price) payable public exceptOrganizer{
        require(msg.sender != address(0),"Msg.Sender cannot be a zero address");
        require(_price > 0, "The Resell price cannot be zero" );
        address _owner = ownerOf(_tokenId);
        uint _index = getTokenIndexByTokenID(_tokenId);
        require(msg.sender == _owner, "Only owner can resell the Ticket" );
        transferFrom(tickets[_index].owner,tickets[_index].organiser, _tokenId);
        tickets[_index].owner =tickets[_index].organiser;
        tickets[_index].status = TicketStatus.FOR_SALE;
        tickets[_index].price = _price;
        pendingTicketCount++;
    }

} 