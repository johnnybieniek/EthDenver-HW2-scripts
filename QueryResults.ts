import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"

import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const deployedContractAddress = "0xa92e8E513E72F98c2313a2912d1B792b5Ee426FA"
const PROPOSAL_NUM = 3
const proposals = ["Chocolate", "Vanilla", "Lemon"]

async function main() {
    console.log("Script for querying results")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API_KEY })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)

    const ballotContractFactory = new Ballot__factory(signer)
    const ballotContract = await ballotContractFactory.attach(deployedContractAddress)

    //Getting proposals:

    console.log(" ")
    console.log(`Valid proposals: ${proposals}`)

    console.log(`Proposal in smart contract:`)
    for (let i = 0; i < PROPOSAL_NUM; i++) {
        const proposal = await ballotContract.proposals(i)

        const proposalinContract = ethers.utils.parseBytes32String(proposal.name)
        const res = proposals.includes(proposalinContract)

        console.log(
            `[INFO] Proposal ${i}: name=${ethers.utils.parseBytes32String(
                proposal.name
            )} is valid? = ${res}; voteCount = ${proposal.voteCount.toNumber()} votes`
        )
    }

    console.log(" ")
    console.log("Winning proposal check")
    const winnerProposalName = await ballotContract.winnerName()
    console.log(`The winner account is ${ethers.utils.parseBytes32String(winnerProposalName)}`)

    //Check who the winner is:
    // const winner = await ballotContract.winningProposal();
    // const proposalId = winner.toString();
    // const winningProposal = await ballotContract.proposals(proposalId);
    // console.log(`The winning proposal is: ${ethers.utils.parseBytes32String(winningProposal.name)}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
