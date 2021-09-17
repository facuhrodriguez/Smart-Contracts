const HotelRoomContract = artifacts.require("../contracts/HotelRoom.sol");

module.exports = function (deployer) {
    deployer.deploy(HotelRoomContract);
};
