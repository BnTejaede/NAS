var express = require('express'),
    accessControl = require("../access-control"),
    model = require("../model"),
    router = express.Router(),
    bookmarkRouter = require("./bookmarks"),
    bodyParser = require('body-parser');


router.use(accessControl);
router.use("/:user/bookmark", bookmarkRouter);

/**
 * @swagger
 * /user/{userId}/group:
 *   get:
 *     description: Get a Group by User ID. If a Group does not exist for the User, one will be created.
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: '#/parameters/userId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns a Group
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Group'
 */
router.get('/:user/group', function (req, res) {
    var userID = req.params.user;
    getGroupForUserID(userID).then(function (group) {
        res.send(group);
    }).catch(function (error) {
        res.status(500);
        res.render({error: error});
    });
});

/**
 * @swagger
 * /user/{userId}/defaultBookmark:
 *   get:
 *     description: Get the default Bookmark for this User
 *     tags:
 *      - Bookmarks
 *     parameters:
 *       - $ref: '#/parameters/userId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns a Bookmark
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Bookmark'
 *   put:
 *     description: Set default bookmark for user.
 *     tags:
 *      - Bookmarks
 *     parameters:
 *       - $ref: '#/parameters/userId'
 *       - $ref: '#/parameters/defaultBookmarkId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of User
 *         schema:
 *           type: object
 */
router.get('/:user/defaultBookmark', function (req, res) {
    var userID = req.params.user,
        user;
    return model.User.findOrCreate({where: {id: userID}}).then(function (result) {
        user = result[0];
        return user.defaultBookmarkId === null ? null : model.Bookmark.find({
            where: {
                id: user.defaultBookmarkId
            }
        });
    }).then(function (bookmark) {
        var response = bookmark || {id: null};
        res.send(response);
    }).catch(function (error) {
        console.log(error);
        res.status(500);
        res.send({error: error});
    });
});

router.put('/:user/defaultBookmark', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var userID = req.params.user,
        newDefault = req.body.bookmarkId,
        where = {}, user, hasGroup;

    return model.User.findOrCreate({where: {id: userID}}).then(function (result) {
        user = result[0];
        user.defaultBookmarkId = newDefault;
        return user.save();
    }).then(function (bookmarks) {
         res.send({
             id: user.id,
             defaultBookmarkId: newDefault
         });
    }).catch(function (error) {
        res.status(500);
        res.send({error: error});
    });
});


function getGroupForUserID (userID) {
    return model.User.findOrCreate({where: {id: userID}}).then(function (result) {
        var user = result[0],
            hasGroup = typeof user.groupId === "number";
        return hasGroup ? user.getGroup() : createGroupForUser(user);
    });
}

function createGroupForUser(user) {
    var rawGroup = makeDefaultGroup(user.id),
        group;
    return model.Group.create(rawGroup).then(function (result) {
        group = result;
        return user.setGroup(group);
    }).then(function () {
        return group;
    });
}

function makeDefaultGroup(username) {
    return {
        name: "Owned by " + username,
        description: "Created for the purpose of supplying " + username + " with personal bookmarks"
    }
}

module.exports = router;