// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract DigitalProduct {
    
    address public owner;

    struct Product{
        string name;
        uint8 pId;
        uint price;
        address payable pOwner;
    }

    struct Buyer{
        address payable  buyer;
        uint8 pId;
        uint8 ownershipId;
    }

    Product[] public Products;
    Buyer[] public Buyers;

    mapping (address=>uint8[]) public sellerToProduct;
    mapping (address=>uint8[]) public buyerToProduct;
    mapping (uint8=>uint8[]) public productToOwnership;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier purchaseRequirments(uint8 _pid,uint _amount,address _buyerAddr){
        bool hasOwnership = checkOwnerShip(_buyerAddr,_pid);
        bool isiN = IsvalidProduct(_pid);
        uint productPrice = getProductPriceById(_pid);
        require(_amount>= productPrice,"Insuffieceint Fund");
        require(isiN==true,"Invalid Product");
        require(_buyerAddr!=owner,"Contract Owner Cannot Buy Products");
        require(isSelller(_pid, _buyerAddr)==false,"Seller Cannot Buy His Own Product");
        require(hasOwnership==false,"You Already Own This Product");
        _;

    }
    modifier notOwner(address _buyeraddr){
        require(_buyeraddr!=owner,"Contract Owner Cannot List Product");
        require(isBuyer(_buyeraddr)==false,"Buyer Cannot List Product");
        _;
    }


    // Create Product
    function createProduct(string memory _name, uint _price) public notOwner(msg.sender){
        uint8 pId = uint8(randomProductId(_name, _price+1, msg.sender));
        Product memory newProduct = Product(_name,pId,_price,payable(msg.sender));
        Products.push(newProduct);
        sellerToProduct[newProduct.pOwner].push(newProduct.pId);
    }

    // Buy Product
    function buyProduct(uint8 _pid)  public payable  purchaseRequirments(_pid,msg.value,msg.sender)  {
        address sellerAdd =  getSellerAddress(_pid);
        uint sellCommision = ((msg.value)*10)/100;
        uint8 ramdomOwnership = uint8(randomOwnershiptid(_pid, msg.sender,getProductPriceById(_pid)+1));
        Buyer memory newBuyer = Buyer(payable(msg.sender),_pid,ramdomOwnership);
        payable(owner).transfer(sellCommision);
        payable(sellerAdd).transfer(msg.value-sellCommision);
        Buyers.push(newBuyer);
        buyerToProduct[newBuyer.buyer].push(newBuyer.pId);
        productToOwnership[newBuyer.pId].push(newBuyer.ownershipId);
    }


    //Helper Fucntions
    function randomProductId(string memory _pName, uint _Pprice, address _selleradd) view internal returns (uint) {
        uint randomid = uint(
            keccak256(abi.encodePacked(
             blockhash(block.timestamp-100),
             _pName,
             _Pprice,
             _selleradd)))%100;
        return randomid;
    }

        function randomOwnershiptid(uint8 _pId, address _buyeradd,uint _pPrice) view internal returns (uint) {
        uint randomownerShipId = uint(
            keccak256(abi.encodePacked(
             blockhash(block.timestamp-100),
             blockhash(block.number-3),
             _pId,
             _buyeradd,
             _pPrice)))%100;
        return randomownerShipId;
    }

    function getProductPriceById(uint8 _pid) view internal  returns(uint) {
        uint price=0;
        for (uint i=0; i<Products.length; i++) 
        {
            if(Products[i].pId==_pid){
                price = Products[i].price;
                break ;
            }
        }
        return price;
    }

      function IsvalidProduct(uint8 _pid) view internal  returns(bool) {
        bool isIN =false;
        for (uint i=0; i<Products.length; i++) 
        {
            if(Products[i].pId==_pid){
                isIN = true;
                break ;
            }
        }
        return isIN;
    }

    function checkOwnerShip(address _buyerAdd,uint8 _pid) view internal returns (bool){
        
        bool isOwner = false;
        for (uint i =0; i<buyerToProduct[_buyerAdd].length; i++){

            if(buyerToProduct[_buyerAdd][i]== _pid){
                isOwner = true;
                break;
            }
        } 
        return isOwner;
    }
    function getSellerAddress(uint8 _pid) view internal returns (address){
        address sellerAddr;
        for (uint i = 0; i<Products.length; i++) {
            if(Products[i].pId == _pid){
                sellerAddr = Products[i].pOwner;
                break;
            }
        }
        return  sellerAddr;
    }

    function isSelller(uint _pid, address _selleraddr) view internal returns(bool) {
        
        bool isIN =false;
        for (uint i =0; i<Products.length; i++) {
                if(Products[i].pId == _pid){
                    if(Products[i].pOwner==_selleraddr){
                        isIN = true;
                        break;
                    }
                }
        }
        return isIN;
    }

        function isBuyer(address _buyeraddr) view internal returns(bool) {
        
        bool isIN =false;
        for (uint i =0; i<Buyers.length; i++) {
            if(Buyers[i].buyer==_buyeraddr){
                isIN = true;
                break;
            }
        }
        return isIN;
    }


}