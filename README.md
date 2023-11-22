# Motive

Creating A Smart Contract Where People Can Buy & Seller Digital Products In A Decentralized System.

## Contracts Features

There Are Features By That **Buyers** ,**Sellers** & **Contract Owner**
Can be Benefited. Those Are Given Below

### Features For Buyers


- Buyer Will Get A **Ownership Id** After Successfully Purchase Of A Product Which Will Be Stored On Chain (In Here On **Ethereum BlockChain**) & Which Is **Immutable**  And **Unique**. With That Buyer Can Claim His Ownership of That product. 
- And A Buyer Can Buy A Product Only Once But Can Buy Multiple Different Products Which Reduces Unnecessary Purchase Of Same Product.
### Features For Sellers
- Seller Can List/Upload Their Products and Set The Price Price Of That Product  **For Free**.
- Seller Can List  **Multiple Products** From An Single Address.
- Seller Will  **Get Paid** Immediately After The Purchase Of A Product.

	==Note==: Seller Have To Pay **10%** of Product Price As Sales Commission To The Contract Owner And It Will Be Deducted From Selling Price At The Time Of Purchase And Rest of Amount Will Be Sent To The Seller.
	
### Features For Contract Owner


- Contact Owner Will Get Sales Commission For Every Purchase.

----
## Contract Workflow



There Are Some Rules And Limitation That Must Be Followed By The Buyers And Sellers.
- Primarily **Contract Owner** Cannot List/Upload  Products On The And Also Cannot Buy
> This was implemented so that no collision take place with the seller address and contract address as contract address/contract owner receive sales commission.
- Seller Cannot Buy Product
- Seller Must Have To Pay **Sales Commission** To Contract Owner.
- Buyer Must Have Enough **Balance**  To Buy A Product Otherwise Purchase Cannot Be Completed.
- Buyer Cannot Buy A  Same Product **Twice**.
- Buyer Is Not Permitted To Sell Products .
- Each Product Will Have **Unique Id**
- **Ownership Id** Will Be Unique For **Each** **Product** Purchase For **Each Buyer**.
- Buyer Cannot Buy **Product** That Is **Not Listed/Uploaded** In The Contract.

---

## Language And Tools Used

- **Solidity** For Contract Development
- **Hardhat** For Test Deployment
- **Chai** **Mocha** **Ethereum-Waffle** For testing With **Hardhat**

