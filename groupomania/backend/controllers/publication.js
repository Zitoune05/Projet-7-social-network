const jwt = require('jsonwebtoken');                        //Package pour créer des jetons uniques
const models = require('../models');
const commentsCtrl = require('../controllers/commentaire');
const { sequelize } = require('../models');


// Récupère toutes les publications dans la base de données pour les affichers
exports.getAllpublications = (req, res, next) => {


  models.Publication.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      model: models.User,
      attributes: ['username']
    },
    {
      model: models.Commentaire,
      require: false
    }
    ]
  })
    .then(
      (publications) => {
        res.status(200).json(publications);
      }
    )
    .catch(error =>
      console.log(error));
};


// Récupère une publication pour l'afficher
exports.getOnePublication = (req, res, next) => {
  models.Publication.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: models.User,
      attributes: ['username']
    }
  })
    .then((publication) => res.status(200).json(publication))
    .catch(error => res.status(400).json({ error }));
};

// Récupère une publication en fonction de l'utilisateur
exports.getPublicationsUser = (req, res, next) => {

  models.Publication.findAll({
    order: [["id", "DESC"]],
    where: { userId: req.params.id },
    include: {
      model: models.User,
      attributes: ["username"]
    }
  })
    .then(response => res.status(200).json(response))
    .catch(error => res.status(400).json({ error }));
};


// Creation de publication
exports.createMessage = (req, res, next) => {

  const token = req.headers.authorization.split(" ")[1];          // Token attribué à l'utilisateur
  const decodedToken = jwt.verify(token, process.env.TOKEN);      // Token comparé
  const userId = decodedToken.userId;

  // Params
  let imageUrl = "";
  if (req.file) { imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }

  else if (content == null) {
    return res.status(400).json({ 'error': 'Paramètres manquants ' });
  }

  models.User.findOne({ attributes: ["id"], where: { id: userId } })
    .then(
      models.Publication.create({
        UserId: userId,
        content: req.body.content,
        imageUrl: imageUrl,
        comments: req.body.comments
      })
        .then((response) => res.status(200).json({ response: " Publication envoyée avec succé !" }))
        .catch((err) => res.status(401).json({ err }))
    )
    .catch(() => res.status(500).json({ 'error': 'unable to verify user' }))
};

// Modification de la publication sélectionnée
exports.modifypublication = (req, res, next) => {

  models.Publication.findOne({ attributes: ['id'], where: { id: req.params.id } })
    .then(
      models.Publication.update({
        content: req.body.content,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      },
        { where: { id: req.params.id } })
        .then((response) => res.status(200).json({ response: " Publication modifiée avec succé !" }),
      )
        .catch((err) => res.status(401).json({ err }))
    )
    .catch(() => res.status(500).json({ 'error': 'unable to verify publication' }))
};

// Pour supprimer une publication
exports.deletePublication = (req, res, next) => {

  models.Publication.destroy({
    where: { id: req.params.id }
  })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(401).json({ err }));
};

// Pour supprimer une publication en tant qu'administrateur
exports.deletePublication = (req, res, next) => {

  models.Publication.destroy({
    where: { id: req.params.id }
  })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(401).json({ err }));
};



