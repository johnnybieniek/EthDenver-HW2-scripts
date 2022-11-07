import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"

import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const deployedContractAddress = "0xa92e8E513E72F98c2313a2912d1B792b5Ee426FA"

async function main() {
    //Type in account to query
    //const account = "0x6BB867464442d341eecB16591251b2e87a62D3cB";
    const accountToQuery = "0x31f83c5f7812cfb925402c74b57687616e09e41b"

    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API_KEY })
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)

    const ballotContractFactory = new Ballot__factory(signer)
    const ballotContract = await ballotContractFactory.attach(deployedContractAddress)

    const voter = await ballotContract.voters(accountToQuery) //(signer.address);
    const weight = voter.weight.toNumber()
    const voted = voter.voted.toString()
    const delegated = voter.delegate.toString()

    console.log(
        `Account=${accountToQuery}, weight=${weight}, voted?=${voted}, delegatedAccount=${delegated}`
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
