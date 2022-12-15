const { createApp } = Vue

let app = createApp({
    data() {
        return {
            url: "https://amazing-events.herokuapp.com/api/events",
            eventos: [],
            categories: [],
            categoriesUpcoming: [],
            categoriesPast: [],
            filtradosEventos: [],
            upcomingFiltrados: [],
            pastFiltrados: [],
            filtradosPorCategory: [],
            filtradosPorFechaUE: [],
            filtradosPorFechaPE: [],
            eventoDetails: [],
            search: '',


        }
    },
    created() {
        this.cargarData(this.url)


    },
    methods: {
        cargarData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.eventos = data.events
                    this.data = data
                    this.filtradosEventos = data.events
                    this.filtradosPorFechaPE = this.eventos.filter((evento) => evento.date < this.data.currentDate)
                    this.filtradosPorFechaUE = this.eventos.filter((evento) => evento.date > this.data.currentDate)
                    this.upcomingFiltrados = this.filtradosPorFechaUE
                    this.pastFiltrados = this.filtradosPorFechaPE
                    this.eventos.forEach(evento => !this.categories.includes(evento.category) ? this.categories.push(evento.category) : "")
                    this.filtradosPorFechaPE.forEach(evento => !this.categoriesPast.includes(evento.category) ? this.categoriesPast.push(evento.category) : "")
                    this.filtradosPorFechaUE.forEach(evento => !this.categoriesUpcoming.includes(evento.category) ? this.categoriesUpcoming.push(evento.category) : "")
                    this.details()


                })
                .catch(error => console.log(error))
        },
        revenues(array, array2) {
            categoria = array.filter(eventos => eventos.category === array2)
            revenue = categoria.map(categoria => categoria.price * categoria.estimate ? categoria.price * categoria.estimate : categoria.price * categoria.assistance)

            totalRevenue = revenue.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
            })
            return totalRevenue
        },

        attendancePercentage(array, array2) {
            asistencia = array.filter(eventos => eventos.category === array2)
            asistencia2 = asistencia.map(eventos => parseInt(eventos.estimate ? eventos.estimate : eventos.assistance))

            let numMax = Math.max(...asistencia2)
            const TodosSumado = asistencia2.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
            })
            let Porcentaje = (numMax / TodosSumado * 100).toFixed(2)
            return Porcentaje
        },
        assistenciaMayor(array) {

            let asistidos = array.map(evento => evento.assistance * 100 / evento.capacity)
            let asistidosNum = asistidos.filter(Boolean)

            let numMayor = Math.max(...asistidosNum)

            return numMayor

        },
        asistenciaMenor(array) {
            let asistidos = array.map(evento => evento.assistance * 100 / evento.capacity)
            let asistidosNum = asistidos.filter(Boolean)

            let numMenor = Math.min(...asistidosNum)

            return numMenor
        },
        mayorCapacidad(array) {
            let capacidades = array.map(evento => parseInt(evento.capacity))
            let maximo = Math.max(...capacidades)
            return maximo
        },
        details() {
            const queryString = location.search
            const parametros = new URLSearchParams(queryString)
            const id = parametros.get("id")

            this.eventoDetails = this.eventos.find(item => item._id == id)
        }


    },
    computed: {

        filtros() {
            let primerFiltro = this.filtradosEventos.filter(evento => evento.name.toLowerCase().includes(this.search.toLowerCase()))
            if (this.filtradosPorCategory.length) {
                this.eventos = primerFiltro.filter(evento => this.filtradosPorCategory.includes(evento.category))

            } else {
                this.eventos = primerFiltro
            }
            primerFiltro = this.pastFiltrados.filter(evento => evento.name.toLowerCase().includes(this.search.toLowerCase()))
            if (this.filtradosPorCategory.length) {
                this.filtradosPorFechaPE = primerFiltro.filter(evento => this.filtradosPorCategory.includes(evento.category))

            } else {
                this.filtradosPorFechaPE = primerFiltro
            }
            primerFiltro = this.upcomingFiltrados.filter(evento => evento.name.toLowerCase().includes(this.search.toLowerCase()))
            if (this.filtradosPorCategory.length) {
                this.filtradosPorFechaUE = primerFiltro.filter(evento => this.filtradosPorCategory.includes(evento.category))

            } else {
                this.filtradosPorFechaUE = primerFiltro
            }


        }

    }
})

app.mount('#app')