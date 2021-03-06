'use strict';

//Importação da model com mongoose(mongodb)
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

const repository = require('../repositories/product-repository')
const ValidationContract = require('../validators/fluent-validator')

//Listando os produtos cadastrados, pegando do banco
exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição.',
            error: e.message
        });
    }
}

//Listando o SLUG dos produtos cadastrados, pegando do banco
exports.getBySlug = async(req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message
        });
    }
}


//Listando os ID dos produtos cadastrados, pegando do banco
exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message
        });
    }
}

//Listando as TAGS dos produtos cadastrados, pegando do banco
exports.getByTag = async(req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message
        });
    }
}

//Enviando produto para banco de dados, pegando do banco
exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O titulo deve conter pelo menos 3 caracteres')
    contract.hasMinLen(req.body.slug, 3, 'O titulo deve conter pelo menos 3 caracteres')
    contract.hasMinLen(req.body.description, 3, 'O titulo deve conter pelo menos 3 caracteres')

    //se os dados forem invalidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return
    }

    try{
        
        await repository.create(req.body)
        res.status(201).send({
            message: 'Produto cadastado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição. ',
            error: e.message
        }); 
    }
};

//Atualizando o produto, pegando do banco
exports.put = async(req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message
        });
    }
};

//Deletando o produto, pegando do banco
exports.delete = async(req, res, next) => {
    try {

        if(!req.body.id || req.body.id == "") return res.status(400).send({error: "parametro invalido"})      
        await repository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição. ',
            error: e.message
        });
    }
};