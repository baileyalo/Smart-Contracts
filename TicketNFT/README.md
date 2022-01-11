# Basic TicketNFT Hardhat Project

This project demonstrates a basic NFT use case using ERC721 contract. 

Functionalities
    Organiser
        - Creating Tickets 
        - Approving Requests
    Other User
        - Request for Approval
        - Buying Tickets
        - Reselling Tickets

Functional Flow
    Deploy the TicketNFT contract.
    Use the same Account(Organiser) to Create Tickets.
    Select a different account/accounts to request for Approval.
    Use Organiser account to Approval all the requests.
    Now you can use any of the approved accounts to buy from list of createed tokens and re-sell the tokens you own.

Compile
    npx hardhat compile

Run Test Scripts
    npx hardhat test

Deploy
    npx hardhat run scripts/deployTicketNFT.js --network <NetworkName>



