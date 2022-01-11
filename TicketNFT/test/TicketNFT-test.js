const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketNFT Testing", function () {

    this.beforeEach(async function() {

        const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
        ticketNFT = await TicketNFT.deploy("TestNFTName","TestNFTSymbol");
        await ticketNFT.deployed();
        [organizer, addr1, addr2,addr3] = await ethers.getSigners();
    })

    it("Create Ticket", async function () {
        //Positive Testing
        expect(await ticketNFT.balanceOf(organizer.address)).to.equal(0);        
        await ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","25 Jan 2020",123); 
        expect(await ticketNFT.balanceOf(organizer.address)).to.equal(1);

        //Neagtive Testing 1     
        await expect ( ticketNFT.connect(organizer).createTickets("","TestVenue","25 Jan 2020",123)).to.be.revertedWith('The title cannot be empty'); 

        //Neagtive Testing 2        
        await expect ( ticketNFT.connect(organizer).createTickets("TestTtile","","25 Jan 2020",123)).to.be.revertedWith('The description cannot be empty'); 

        //Neagtive Testing 3      
        await expect ( ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","",123)).to.be.revertedWith('The date cannot be empty'); 

        //Neagtive Testing 4       
        await expect ( ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","25 Jan 2020",0)).to.be.revertedWith('The price cannot be zero'); 


    });

    it("Testing Ownerof()", async function () {    

        //Should match with the address of Owner account
        await ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","25 Jan 2020",123); 
        expect(await ticketNFT.ownerOf(0)).to.equal(organizer.address);

        //Neagtive Testing 1       
        const ticketCount= await ticketNFT.connect(organizer).getpendingTicketCount(); 
        await expect ( ticketNFT.ownerOf(ticketCount +1 )).to.be.revertedWith('ERC721: approved query for nonexistant token'); 
       
    });

    it("Testing safetransferFrom()", async function () {

        //Should transfer token from address1 to address2
        await ticketNFT.connect(organizer).mint(organizer.address,0,"Mint Test");
        expect(await ticketNFT.ownerOf(0)).to.equal(organizer.address);
        await ticketNFT.connect(addr1).requestapproval();    
        await ticketNFT.connect(addr2).requestapproval();   
        await ticketNFT.connect(organizer).approveall(); 
        ticketNFT['safeTransferFrom(address,address,uint256)'](organizer.address,addr1.address,0);
        console.log(await ticketNFT.ownerOf(0));
        expect(await ticketNFT.ownerOf(0)).to.equal(addr1.address);

    });


    it("Testing transferFrom()", async function () {


        //Should transfer token from address1 to address2
        await ticketNFT.connect(organizer).mint(organizer.address,0,"Mint Test");
        expect(await ticketNFT.ownerOf(0)).to.equal(organizer.address);
        await ticketNFT.connect(addr1).requestapproval();    
        await ticketNFT.connect(addr2).requestapproval();   
        await ticketNFT.connect(organizer).approveall(); 
        await ticketNFT.connect(organizer).transferFrom(organizer.address,addr1.address,0);   
        expect(await ticketNFT.ownerOf(0)).to.equal(addr1.address);
        //console.log(await ticketNFT.ownerOf(0));
         //Neagtive Testing 1       
         var ticketCount= await ticketNFT.connect(organizer).getpendingTicketCount(); 
         await expect ( ticketNFT.transferFrom(addr1.address,addr2.address,ticketCount+1)).to.be.revertedWith('ERC721: approved query for nonexistant token'); 

        //Neagtive Testing 2       
        //const ticketCount= await ticketNFT.connect(organizer).getpendingTicketCount(); 
        await expect ( ticketNFT.transferFrom(addr1.address,addr2.address,ticketCount)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved'); 

        //Neagtive Testing 3   
        const zeroAddress= "0x0000000000000000000000000000000000000000";
        await expect ( ticketNFT.transferFrom(addr2.address,zeroAddress,ticketCount)).to.be.revertedWith('ERC721: transfer to the zero address'); 
                 
        //Neagtive Testing 4     
        await ticketNFT.connect(organizer).mint(organizer.address,1,"Mint Test");
        await expect ( ticketNFT.transferFrom(addr2.address,addr3.address,1)).to.be.revertedWith('ERC721: transfer of token that is not own'); 

    });


    it("Testing approve()", async function () {

        //Owner Should be able to approve other addresses for the specified tokenID
        await ticketNFT.connect(organizer).mint(organizer.address,0,"Mint Test");
        await ticketNFT.connect(organizer).approve(addr1.address,0);
        expect(await ticketNFT.getApproved(0)).to.equal(addr1.address);  

         //Neagtive Testing 1
        var ticketCount= await ticketNFT.connect(organizer).getpendingTicketCount(); 
        await expect ( ticketNFT.approve(addr1.address,ticketCount+1)).to.be.revertedWith('ERC721: approved query for nonexistant token'); 

         //Neagtive Testing 2
        await ticketNFT.connect(organizer).mint(organizer.address,1,"Mint Test");
        await ticketNFT.connect(organizer).transferFrom(organizer.address,addr1.address,1);   
        await expect ( ticketNFT.connect(organizer).approve(addr2.address,1)).to.be.revertedWith('ERC721: approve caller is not owner nor approved for all'); 

         //Neagtive Testing 3
        await ticketNFT.connect(organizer).mint(organizer.address,2,"Mint Test");
        await ticketNFT.connect(organizer).transferFrom(organizer.address,addr1.address,2); 
        await expect ( ticketNFT.connect(addr1).approve(addr1.address,2)).to.be.revertedWith('ERC721: approval to current owner'); 

    });

    it("Testing isApprovedForAll()", async function () {
        //Owner Should be able to approve other addresses for all the tokenIDs
        await ticketNFT.connect(organizer).setApprovalForAll(addr1.address,true);
        expect(await ticketNFT.isApprovedForAll(organizer.address,addr1.address)).to.equal(true);  

        //Negative Testing 1
        await expect ( ticketNFT.connect(organizer).setApprovalForAll(organizer.address,true)).to.be.revertedWith('ERC721: approve to caller'); 

    });

    it("Testing getApproved()", async function () {
        //Anyone should be able to fetch the address approved for a particular token
        await ticketNFT.connect(organizer).mint(organizer.address,0,"Mint Test");
        await ticketNFT.connect(organizer).approve(addr1.address,0);
        expect(await ticketNFT.getApproved(0)).to.equal(addr1.address);  

        //Negative Testing 1
        await expect ( ticketNFT.connect(addr1).getApproved(2)).to.be.revertedWith('ERC721: approved query for nonexistant token'); 
    });

    it("Testing balanceOf()", async function () {
        //Anyone should be able to fetch the balance of a particulat address
        expect(await ticketNFT.balanceOf(organizer.address)).to.equal(0);        
        await ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","25 Jan 2020",123); 
        expect(await ticketNFT.balanceOf(organizer.address)).to.equal(1);

        //Negative Testing 1
        const zeroAddress= "0x0000000000000000000000000000000000000000";
        await expect ( ticketNFT.balanceOf(zeroAddress)).to.be.revertedWith('ERC721 : balance query for zero address'); 
    });


    it("Transfer Event", async function () {

        await ticketNFT.connect(addr1).mint(addr1.address,0,"Mint Test");
        await ticketNFT.connect(addr1).requestapproval();    
        await ticketNFT.connect(addr2).requestapproval();   
        await ticketNFT.connect(organizer).approveall(); 
        await expect(ticketNFT.connect(addr1).transferFrom(addr1.address,addr2.address,0)).to.emit(ticketNFT.connect(addr1), 'Transfer').withArgs(addr1.address,addr2.address,0);

    });

    it("Approval Event", async function () {

        await ticketNFT.connect(organizer).mint(organizer.address,0,"Mint Test");
        await expect(ticketNFT.connect(organizer).approve(addr1.address,0)).to.emit(ticketNFT.connect(organizer), 'Approval').withArgs(organizer.address,addr1.address,0);

    });

    it("ApprovalForAll Event", async function () {

        await expect(ticketNFT.connect(organizer).setApprovalForAll(addr1.address,true)).to.emit(ticketNFT.connect(organizer), 'ApprovalForAll').withArgs(organizer.address,addr1.address,true);

    });

    it("Functional Testing", async function () {
        
        //Creating Ticket
        expect(await ticketNFT.balanceOf(organizer.address)).to.equal(0);        
        await ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","25 Jan 2020",123); 
        expect(await ticketNFT.balanceOf(organizer.address)).to.equal(1);

        //Creating Ticket Negative
        await expect ( ticketNFT.connect(addr1).createTickets("TestTtile","TestVenue","25 Jan 2020",123)).to.be.revertedWith('Only Organizer can create tickets and approve requests'); 

        //Requesting Approval #1
        expect(await ticketNFT.getapprovalcount()).to.equal(0);        
        await ticketNFT.connect(addr1).requestapproval();  
        expect(await ticketNFT.getapprovalcount()).to.equal(1);  

        //Requesting Approval #2
        expect(await ticketNFT.getapprovalcount()).to.equal(1);        
        await ticketNFT.connect(addr2).requestapproval();    
        expect(await ticketNFT.getapprovalcount()).to.equal(2);

        //Requesting Approval Negative #1
        await expect ( ticketNFT.connect(organizer).requestapproval()).to.be.revertedWith('This operation is not for Organizer'); 

        //Approving all requests
        await ticketNFT.connect(organizer).approveall(); 
        expect(await ticketNFT.getapprovalcount()).to.equal(0);

        //Approving all requests Negative 
        await expect ( ticketNFT.connect(addr2).approveall()).to.be.revertedWith('Only Organizer can create tickets and approve requests'); 

        //Buying Ticket
        expect(await ticketNFT.getpendingTicketCount()).to.equal(1);       
        await ticketNFT.connect(addr1).buyTicket(0,{value: ethers.utils.parseEther("1.0")}); 
        expect(await ticketNFT.getpendingTicketCount()).to.equal(0);

        //Buying Ticket Negative 
        await expect ( ticketNFT.connect(organizer).buyTicket(0,{value: ethers.utils.parseEther("1.0")})).to.be.revertedWith('This operation is not for Organizer'); 
        await ticketNFT.connect(organizer).createTickets("TestTtile","TestVenue","25 Jan 2020",12); 
        await expect ( ticketNFT.connect(addr1).buyTicket(1,{value: ethers.utils.parseEther("0.000000000000000011")})).to.be.revertedWith('Ticket price is more than supplied ether'); 
        
        //Reselling Ticket
        expect(await ticketNFT.getpendingTicketCount()).to.equal(1);
        await ticketNFT.connect(addr1).resellTicket(0,345); 
        expect(await ticketNFT.getpendingTicketCount()).to.equal(2);

        //Reselling Ticket Negative 
        await expect ( ticketNFT.connect(organizer).resellTicket(0,345)).to.be.revertedWith('This operation is not for Organizer'); 
        await expect ( ticketNFT.connect(addr1).resellTicket(0,345)).to.be.revertedWith('Only owner can resell the Ticket');
        await expect ( ticketNFT.connect(addr1).resellTicket(0,0)).to.be.revertedWith('The Resell price cannot be zero');
        
    });
});
