
const Ballot = artifacts.require("/contacts/Ballot.sol");
const truffleAssert = require("truffle-assertions");

contract("Ballot", (accounts)=> {
  const success = '0x01'
  const owner = 'should initialize the owner as the chairperson'
  //const validPhaseError = 'Not the required phase'
  const onlyChairpersonError = 'Only chairperson can perform this operation'
  const changeStateError = 'Can only move to greater state'
  const votedError = 'Voter has already voted'
  const wrongProposalError = 'Proposal number over limit'

  let ballot

  describe("Initial deployment", async () => {
    it("should assert true", async function () {
      ballot = await Ballot.new(3)
    });

    it("should initialize the owner as the chairperson", async () => {
      let owner = await ballot.register(accounts[1])
    });
  });

  describe("Registration", () => {
    let BallotInstance;
    beforeEach(async () => {
      let result = await ballot.register(accounts[1], { from: accounts[0]})
      assert.equal(result.receipt.status, success)
    });

    it("will revert if non chairperson registers the voter", async () => {
      await truffleAssert.reverts(
        ballot.register(accounts[2], { from: accounts[1]}),
        truffleAssert.ErrorType.REVERT,
        onlyChairpersonError,
        onlyChairpersonError
      )
    });

    it("chair person can register the voters", async () => {
      let result = await ballot.register(accounts[1], { from: accounts[0]})
      assert.equal(result.receipt.status, success)
    });
  });

  describe("Change State", () => {

    let BallotInstance;
    beforeEach(async () => {
      ballot = await Ballot.new(3)
    });

    it("will revert if non-chairperson changes the state", async () => {
      await truffleAssert.reverts(
        ballot.changeState(2, { from: accounts[4]}),
        truffleAssert.ErrorType.REVERT,
        onlyChairpersonError,
        onlyChairpersonError
      )
    });

    it("will revert when voter tries to vote during Reg state", async () => {
       //Registration -> Vote
       await ballot.changeState(2)

       //We have initialized number of proposals to be 3. Must fail when trying to vote for 10.
       await truffleAssert.reverts(
         ballot.vote(10, { from: accounts[1]}), wrongProposalError
       )
    });

    it("chair person can change the state", async () => {
      await ballot.register(accounts[1], { from: accounts[0]})
     
      await truffleAssert(
        ballot.changeState(1, { from: accounts[1]}),
        )
    });

    it("will revert if changeState() is supplied invalid state", async () => {
      await truffleAssert.reverts(
        ballot.changeState(0),
        truffleAssert.ErrorType.REVERT,
        changeStateError,
        changeStateError
      )
    });
  });

  describe("Vote", () => {
    let BallotInstance;
    beforeEach(async () => {
      await ballot.register(accounts[1], { from: accounts[0]})
      await ballot.register(accounts[2], { from: accounts[0]})
    });
    it("Registered voters can vote", async () => {
      await ballot.changeState(2)
      let result = await ballot.vote(1, { from: accounts[1]})
      assert.equal(result.receipt.status, success)
      result = await ballot.vote(1, { from: accounts[2]})
      assert.equal(result.receipt.status, success)
    });
  });

  describe("reqWinner", () => {

    let BallotInstance;
    beforeEach(async () => {
      // get ballot
    });

    it("will revert when winner is requested if winningVoteCount is less than 3", async () => {
   //registration -> voting
   await ballot.changeState(2)
   //Chairperson votes for 2 (has a weight of 2) -> 2 votes of 2
   await ballot.vote(2)
   //1 vote for 1
   await ballot.vote(1, { from: accounts[1]})
   //voting -> done
   await ballot.changeState(3)
   //Does not reveal the winner as none got at least 3 votes
   await truffleAssert.fails(ballot.reqWinner())
    });
  });
});

contract("Ballot", (accounts)=> {
  before(async function () {
    ballot = await Ballot.new(3)
  });

  describe("Registration", () => {
    let BallotInstance;
    beforeEach(async () => {
      // get ballot
    });
    it("chair person can register multiple voters", async () => {
      let result = await ballot.register(accounts[1], { from: accounts[0]})
      assert.equal(result.receipt.status, success)
    });
  });

  describe("Vote", () => {
    let BallotInstance;
    beforeEach(async () => {
      await ballot.register(accounts[1], { from: accounts[0]})
      await ballot.register(accounts[2], { from: accounts[0]})
      await ballot.register(accounts[3], { from: accounts[0]})
      await ballot.register(accounts[4], { from: accounts[0]})
    });
    it("Multiple registered voters can vote", async () => {
      await ballot.changeState(2)
      let result = await ballot.vote(1, { from: accounts[1]})
      assert.equal(result.receipt.status, success)
      result = await ballot.vote(1, { from: accounts[2]})
      assert.equal(result.receipt.status, success)
      result = await ballot.vote(1, { from: accounts[3]})
      assert.equal(result.receipt.status, success)
    });

    it("Should revert when voted user tries to vote again", async () => {
       //Registration -> Vote
       await ballot.changeState(2)
       //Account 1 votes for 1 the first time
       await ballot.vote(1, { from: accounts[1]}) 
       //Should not allow Account 1 to vote again
       await truffleAssert.reverts(
         ballot.vote(1, { from: accounts[1]}),
         truffleAssert.ErrorType.REVERT,
          votedError)
    });

    it("Should revert when voter tires to vote for invalid proposal", async () => {
      await ballot.changeState(2)

     
      await truffleAssert.reverts(
        ballot.vote(10, { from: accounts[1]}), 
        truffleAssert.ErrorType.REVERT,
        wrongProposalError,
        
      )
    });

  });

  describe("reqWinner", () => {
    let BallotInstance;
    beforeEach(async () => {
      await ballot.register(accounts[1], { from: accounts[0]})
      await ballot.register(accounts[2], { from: accounts[0]})
    });
    it("Get winners after voting state is Done", async () => {

       await ballot.changeState(2)      
       //Chairperson's vote (if {from: account[?]} is not mentioned, it defaults to account[0])
       await ballot.vote(2)     
       await ballot.vote(1, { from: accounts[1]})      
       await ballot.vote(2, { from: accounts[2]}) 
       //voting -> done
       await ballot.changeState(3)
 
       let result = await ballot.reqWinner()
       assert.equal(result, 2)
    });
  });

});