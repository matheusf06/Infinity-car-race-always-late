// Iniciando o kaboom
kaboom({
    // Seta uma cor para o background do jogo
    background: [19,133,16],
    fullscreen: true,
    scale: 1,
    global: true
});

// Carregando as sprites para o jogo
loadSprite("player", "https://i.ibb.co/LQTNYf7/player-3.png")
loadSprite("road", "https://i.ibb.co/kHJFTb8/road-3.png")
loadSprite("hole", "https://i.ibb.co/MgBjMJh/New-Piskel-1.png")
loadSprite("coin", "https://i.ibb.co/T0t16JG/New-Piskel.png")

// Funcao  para criacao do menu
function addButton(txt, p, f){
	const button = add([
		text(txt, {
			size: 48,
			width: 320,
			font: "apl386"
		}),
		pos(p),
		area({cursor: "pointer"}),
		scale(1),
		origin("center"),
	])

	// Atribuindo uma funcao para o botao
	button.onClick(f)

	// Verificando se o botao esta sendo escolhido e se sim muda a cor dele e o tamanho
	button.onUpdate(() => {
		if(button.isHovering()){
			const t = time() * 10
			button.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4)
			)
			button.scale = vec2(1.2)
		}
		else{
			button.scale = vec2(1),
			button.color = rgb()
		}
	})

}

// Criacao da cena do jogo
scene("game", () => {
		
	// Setando a velocidade e a gravidade do jogador
	const player_speed = 160
	gravity(0)  
    
	// Setando os scores do jogo e a velocidade dos obstaculos
	let spawnObstaclesTimeHigh = 2.8
	let obstacle_speed = 160
    let score = 0

    // Delimitando o mapa
    addLevel([
        "xx   ",
        "xx   ",
        "xx   ",
        "xx   ",
    ], {
        width: 192,
        height: 192,
        " ": () => [
            sprite("road"),
        ],
    })

    // Adicionando o jogador ao mapa
    const map = addLevel([
        " ",
        "p",
    ], {
        width: 192,
        height: 192,
        "p": () => [
            sprite("player"),
            pos(center()),
            area(),
            body(),
            origin("center"),
            "player"
        ]

    })

	// Criando o jogador e declarando seus atributos
    const player = get("player")[0]

	// Movimentacao no jogo por meio das teclas do teclado
	onKeyDown("left", () => {
		player.move(-player_speed, -80)
	})

	onKeyDown("right", () => {
		player.move(player_speed, -80)
	})

	onKeyDown("up", () => {
		player.move(0,-player_speed)
	})

	onKeyDown("down", () => {
		player.move(0, player_speed)
	})

	// Delimitando os limites do level e ate onde o jogador pode ir
    // Limite de cima
	add([
		rect(width(), 0),
		area(),
		solid(),
	])
    // Limite de baixo
	add([
		rect(width(), 0),
		pos(0,height()),
		area(),
		solid(),
	])
    // Limite da esquerda
	add([
		rect(0, height()),
		pos(384,0),
		area(),
		solid()
	])
    // Limite da direito
	add([
		rect(0,height()),
		pos(960, 0),
		area(),
		solid()
	])

	// Funcao para criacao de novos obstaculos
	function spawnObstacles() {
		const obstacle = add([
            sprite("hole"),
			area(),
			solid(),
			pos(rand(384,912), 0),
			move(DOWN, obstacle_speed),
			"obstacle",
		])

		// Intervalo de tempo para aparecer novos obstaculos
		wait(rand(0.4, spawnObstaclesTimeHigh), spawnObstacles)

			// Destroi o obstaculo assim que ele chegar no final da fase
			obstacle.onUpdate(() => {
			if (obstacle.pos.y+50 > height()) {
					destroy(obstacle)
				}
		})
	}

	// Chamada da funcao para a criacao de obstaculos
	spawnObstacles()

	// Verifica se o jogador colidio com o obstaculo, caso tenha colidido o jogo volta para o menu
	player.onCollide("obstacle", (obstacle) => {
		destroy(obstacle)
		go("restart", score)
	})

    // Funcao para criacao de novas moedas
    function spawCoin(){
        const coin = add([
            sprite("coin"),
            area(),
            solid(),
            pos(rand(384,912), 0),
            move(DOWN, 300),
            "coin",
        ])

        wait(rand(2.5, 14), spawCoin)

        coin.onUpdate(() =>{
            if(coin.pos.y + 50 > height()){
                destroy(coin)
            }
        })
    }

    // Chamando a funcao de criacao de moedas
    spawCoin()

    // Verificando se o jogador colidiu na moeda e se sim destroi a moeda e soma aos scores do jogador
    player.onCollide("coin", (c) => {
        destroy(c)
        score += 10
        scoreLabel.text = "Score: " + score
    })

    // Cria um campo de texto para mostrar os scores do jogador no canto da tela
    const scoreLabel = add([
        text("Score: 0", {
			size: 48
		}), 
        pos(24,24),
    ])

	// Cria um campo de texto para mostrar a velocidade dos obstaculos
	// const obstacleSpeedLabel = add([
	// 	text(obstacle_speed),
	// 	pos(24,96)
	// ])

	// Funcao para a cada 10 segundos aumentar a velocidade dos obstaculos em 3 e diminuir o tempo de respawn de obstaculols
	loop(5, () => {
		obstacle_speed += 5
		if(spawnObstaclesTimeHigh > 0.8){
			spawnObstaclesTimeHigh -= 0.1
		}
	})

	// Funcao para fazer o texto referente a velocidade dos obstaculos atualizar com o passar do tempo
	// onUpdate(() => {
	// 	obstacleSpeedLabel.text = obstacle_speed
	// })
})

// Criando a cena do menu do jogo
scene("menu", () => {

    // Criacao de uma cor preta para o background
    add([
        rect(width(),height()),
        color(0,0,0)
    ])
	// Adicionando um botao
	addButton("Jogar", vec2(width()/2,height()/2), () => go("game"))
})

scene('restart', (score) => {
	
    // Criacao de uma cor preta para o background
	add([
		rect(width(), height()),
		color(0,0,0)
	])
	// Criacao de texto para mostrar o total de scores feitos pelo jogador
	add([
        text("Score total: " + score, {
			size: 48,
			font: "apl386"
		}), 
        pos(width()/2,height()/2),
		scale(1),
		origin("center")
    ])
	addButton("Restart", vec2(width()/2,height()/2 + 100), () => go("game"))
})

// Iniciando o jogo na tela do menu
go("menu")