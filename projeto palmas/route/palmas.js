const express = require("express");
const router = express.Router();
const db = require("../data/database");
const session = require("express-session");

// páginas secundárias
router.get('/', function (req, res){
  res.render('index');
})

// página de início de cadastro
router.get("/start-page", async function (req, res) {
  let data 
  if(req.session.id_pesquisa){
    id = req.session.id_pesquisa;
    [data] = await db.query('SELECT idade, genero, renda_individual, tipo_deficiencia, estuda, trabalha FROM pesquisaod WHERE id_pesquisa = ?', id.idPesquisa);
    data = data[0];
    console.log(data);
  };

  
  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      error: false,
    };
  }
  req.session.inputData = {
    error: false,
  };


  res.render("start-page", { inputData: inputData, data: data });
});
router.post("/start-page", async function (req, res) {
  const check = req.session.id_pesquisa; // check if user already inserted informations once

  const input = req.body;
  const data = [
    input.idade,
    input.genero,
    input.estudo,
    input.trabalho,
    input.necessidades,
    input.renda,
  ];


  if (check) { //in case it already did (update query)
    if (
      !input.idade ||
      !input.genero ||
      !input.estudo ||
      !input.trabalho ||
      !input.necessidades ||
      !input.renda
    ) {
      req.session.inputData = {
        error: true,
      };
      req.session.save(function () {
        res.redirect("start-page");
      });
      return;
    } 
    else {
      const id = req.session.id_pesquisa
      await db.query(
        `UPDATE pesquisaod SET idade = '${input.idade}', genero = '${input.genero}', estuda = '${input.estudo}', trabalha = '${input.trabalho}', tipo_deficiencia = '${input.necessidades}', renda_individual = '${input.renda}' WHERE id_pesquisa ='${id.idPesquisa}'`
      );

      res.redirect("second-page");
      return;
    }
  }


  if ( // in case it didn't (insert query)
    !input.idade ||
    !input.genero ||
    !input.estudo ||
    !input.trabalho ||
    !input.necessidades ||
    !input.renda
  ) {
    req.session.inputData = {
      error: true,
    };
    req.session.save(function () {
      res.redirect("start-page");
    });
    return;
  } 
  else {
    await db.query(
      "INSERT into pesquisaod (idade, genero, estuda, trabalha, tipo_deficiencia, renda_individual) VALUES (?)",
      [data]
    );

    let [idPesquisa] = await db.query("SELECT last_insert_id() AS idPesquisa"); // save user's id as session to use in updates 
    idPesquisa = idPesquisa[0];
    req.session.id_pesquisa = idPesquisa;
    req.session.pass = {
      estudo :input.estudo, 
      trabalho :input.trabalho
    }
    req.session.save(function () {
      res.redirect("second-page");
    });
  } 
});
//

// página sobre domicílio
router.get("/second-page", async function (req, res) {
  const pass = req.session.pass;
  console.log(pass)

  const id = req.session.id_pesquisa;
  let [data] = await db.query('SELECT id_municipio_domicilio, id_quadra_domicilio, quantos_residentes, renda_familiar, quantos_carros_domicilio, quantas_motos_domicilio FROM pesquisaod WHERE id_pesquisa = ?', id.idPesquisa)
  data = data[0];

  let [quadras] = await db.query("SELECT * FROM quadra");
  let [municipios] = await db.query("SELECT * FROM municipio");

  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      error: false,
    };
  }
  req.session.inputData = {
    error: false,
  };
  console.log(id)
  res.render("second-page", { quadras: quadras, municipios: municipios ,inputData: inputData, data: data, pass: pass });
});
router.post("/second-page", async function (req, res) {
  const pass = req.session.pass

  const input = req.body;

  if (
    !input.mora ||
    !input.quadra ||
    !input.moramJunto ||
    !input.rendaFamiliar ||
    !input.automoveis ||
    !input.motocicletas
  ) {
    req.session.inputData = {
      error: true,
    };
    req.session.save(function () {
      res.redirect("second-page");
    });
    return;
  } else {

    let id = req.session.id_pesquisa; 

    await db.query(
      `UPDATE pesquisaod SET id_municipio_domicilio = ${input.mora}, id_quadra_domicilio = ${input.quadra}, quantos_residentes = ${input.moramJunto}, renda_familiar = ?, quantos_carros_domicilio = ${input.automoveis}, quantas_motos_domicilio = ${input.motocicletas} WHERE id_pesquisa = ${id.idPesquisa}`, input.rendaFamiliar 
    );

      if (pass.trabalho === '1'){
        res.redirect('third-page');
      }
      if (pass.trabalho === '0' && pass.estudo === '1'){
        res.redirect('fourth-page');
      }
      if (pass.trabalho === '0' && pass.estudo === '0'){
        res.redirect('/');
      }

  }

  
});
//

// página sobre trabalho
router.get("/third-page", async function (req, res) {
  const pass = req.session.pass;

  const id = req.session.id_pesquisa;
  let [data] = await db.query('SELECT setor_ocupacao, id_municipio_trabalha, id_quadra_trabalha, origem_trabalho, modo_vai_trabalho, tempo_ida_trabalho, hora_comeca_trabalho, hora_encerra_trabalho, destino_trabalho, modo_sai_trabalho, tempo_volta_trabalho FROM pesquisaod WHERE id_pesquisa = ?', id.idPesquisa)
  data = data[0];

    let [quadras] = await db.query("SELECT * FROM quadra");
    let [municipios] = await db.query("SELECT * FROM municipio");
    let [empresas] = await db.query("SELECT * FROM empresa");

    let inputData = req.session.inputData;
    if (!inputData) {
      inputData = {
        error: false,
      };
    }
    req.session.inputData = {
      error: false,
    };

    req.session.save(function (){
      res.render("third-page", { quadras: quadras, inputData: inputData, data: data, municipios: municipios, empresas:empresas, pass:pass }); 
    });
});
router.post("/third-page", async function (req, res) {
    const pass = req.session.pass;
    
    const input = req.body;

    if (
        !input.empregador ||
        !input.localTrabalho ||
        !input.quadraTrabalho ||
        !input.paraTrabalho ||
        !input.modoTrabalho ||
        !input.tempoModoTrabalho ||
        !input.horasInicioTrabalho ||
        !input.horasFimTrabalho ||
        !input.saidaTrabalho ||
        !input.modoSaidaTrabalho ||
        !input.tempoModoSaidaTrabalho
      ) {
        req.session.inputData = {
          error: true,
        };
        req.session.save(function () {
          res.redirect("third-page");
        });
        return;
      } else {

        const id = req.session.id_pesquisa

        await db.query(
          `UPDATE pesquisaod SET setor_ocupacao = '${input.empregador}',id_municipio_trabalha = '${input.localTrabalho}', id_quadra_trabalha = ${input.quadraTrabalho}, origem_trabalho = '${input.paraTrabalho}', modo_vai_trabalho = '${input.modoTrabalho}', tempo_ida_trabalho = '${input.tempoModoTrabalho}', hora_comeca_trabalho = '${input.horasInicioTrabalho}', hora_encerra_trabalho = '${input.horasFimTrabalho}', destino_trabalho = '${input.saidaTrabalho}', modo_sai_trabalho = '${input.modoSaidaTrabalho}', tempo_volta_trabalho =  '${input.tempoModoSaidaTrabalho}' WHERE id_pesquisa = '${id.idPesquisa}'`  , 
        );
      }
      
      if (pass.estudo === '1'){
        res.redirect("fourth-page");
      }
      if (pass.estudo === '0'){
        res.redirect("/");
      }
      
});
//

//página sobre escola
router.get("/fourth-page", async function (req, res) {
  if(!req.session.id_pesquisa){
    res.redirect('sessao-expirada');
  };

  let [escolas] = await db.query("SELECT * FROM escola");
  let [municipios] = await db.query("SELECT * FROM municipio");
  let [quadras] = await db.query("SELECT * FROM quadra");

  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      error: false,
    };
  }
  req.session.inputData = {
    error: false,
  };
  
  req.session.save(function (){
    res.render("fourth-page", { escolas: escolas, quadras: quadras, inputData: inputData, municipios: municipios }); 
  });
});
router.post("/fourth-page", async function (req, res){ 
    const input = req.body;

    if (
        !input.escola ||
        !input.localEscola ||
        !input.quadraEscola ||
        !input.paraEscola ||
        !input.modoEscola ||
        !input.tempoModoEscola ||
        !input.horasInicioEscola ||
        !input.horasFimEscola ||
        !input.saidaEscola ||
        !input.modoSaidaEscola ||
        !input.tempoModoSaidaEscola
      ) {
        req.session.inputData = {
          error: true,
        };
        req.session.save(function () {
          res.redirect("fourth-page");
        });
        return;
      } else {

        const id = req.session.id_pesquisa;

        await db.query(
          `UPDATE pesquisaod SET id_municipio_estuda = '${input.localEscola}', id_quadra_estuda = '${input.quadraEscola}', origem_escola = '${input.paraEscola}', modo_vai_escola = '${input.modoEscola}', tempo_ida_escola = '${input.tempoModoEscola}', hora_comeca_escola = '${input.horasInicioEscola}', hora_encerra_escola = '${input.horasFimEscola}', destino_escola = '${input.saidaEscola}', modo_sai_escola = '${input.modoSaidaEscola}', tempo_volta_escola =  '${input.tempoModoSaidaEscola}' WHERE id_pesquisa = '${id.idPesquisa}'`
        );
      }

    res.redirect("/");
});


module.exports = router;
