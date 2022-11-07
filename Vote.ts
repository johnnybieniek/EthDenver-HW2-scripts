import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"

import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const deployedContractAddress = "0xa92e8E513E72F98c2313a2912d1B792b5Ee426FA"
const proposalToVoteFor = 0 // change this value to choose which proposal to vote for
const proposalsIndexes = [0, 1, 2]

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const ballotContractFactory = new Ballot__factory(signer)
    const ballotContract = ballotContractFactory.attach(deployedContractAddress)

    if (!proposalsIndexes.includes(proposalToVoteFor)) {
        console.log("The proposal number is incorrect!")
    }
    const hasVotingRight = (await ballotContract.voters(signer.address)).weight
    if (hasVotingRight.eq(0)) {
        console.log("I'm sorry, but you do not have voting rights!")
        return
    }

    const hasVoted = (await ballotContract.voters(signer.address)).voted

    if (hasVoted) {
        console.log("You have already voted!")
        const currentVotes = (await ballotContract.proposals(proposalToVoteFor)).voteCount
        console.log(`Your chosen proposal currently has ${currentVotes} votes!`)
        return
    }

    await ballotContract.vote(proposalToVoteFor)
    console.log(
        `Congratulations! You have successfully voted for proposal number: ${proposalToVoteFor}`
    )
    const currentVotes = (await ballotContract.proposals(proposalToVoteFor)).voteCount
    console.log(`Your chosen proposal currently has ${currentVotes} votes!`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
