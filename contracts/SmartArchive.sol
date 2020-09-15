pragma solidity >=0.4.21 <0.6.0;

import "../installed_contracts/Ownable.sol";
import "../installed_contracts/Destructible.sol";
import "../installed_contracts/Pausable.sol";
import "../installed_contracts/ReentrancyGuard.sol";

contract SmartArchive is Ownable,Pausable, Destructible, ReentrancyGuard {

  uint public count = 0;

  struct ArchiveData {
    uint id
    string ipfsJsonLink;
    bool isValid;
    string name;
    address rec_sender;
   }

    ArchiveData[] bundleData;

    constructor() public
    {
        owner = msg.sender;
    }

    function()
    external
    {
        revert("Fallback function. Reverting...");
    }

    function AddToArchive (string memory iLink, string memory name)
    public
    payable
    returns
    (string memory a)
    {
        bundleData.push(ArchiveData(iLink, true, name, msg.sender));
        a = bundleData[count].ipfsJsonLink;
        count++;
    }

    function InvalidateRecord (string memory _id)
    public
    payable
    {
      uint id = stringToUint(_id);
      if(msg.sender == bundleData[id].rec_sender) {
          bundleData[id].isValid = false;
      }
    }

   function stringToUint(string memory s) internal pure returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

    function GetListLenght()
    public
    view
    returns
    (uint b)
    {
      uint bData = 0;
      for (uint i = 0; i < count; i++)
      {
        if(bundleData[i].isValid){
          bData++;
        }
      }
      b = bData;
    }

    function GetList()
    public
    view
    returns
    (string memory d)
    {
       string memory bData;
         for (uint i = 0; i < count; i++)
        {
          if (bundleData[i].isValid){
            bData = strConcat(bData, " ",bundleData[i].ipfsJsonLink,",",bundleData[i].name);
          }
        }
      d = bData;
    }

    function GetValid(string memory id)
    public
    view
    returns
    (bool d) {
      d = bundleData[stringToUint(id)].isValid;
    }

    function strConcat (string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal pure returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (uint i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }
}