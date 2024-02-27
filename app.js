const { createApp, ref } = Vue
const { useToast } = primevue.usetoast
const { useConfirm } = primevue.useconfirm

const App = {
    
    setup() {
        
        const showNew = ref(false)
        const showEdit = ref(false)
        const hasErrors = ref(false)
        const hasEditErrors = ref(false)
        const vagas = ref([])
        const empresa = ref('')
        const empresa_edit = ref('')
        const cargo = ref('')
        const cargo_edit = ref('')
        const responsavel = ref('')
        const responsavel_edit = ref('')
        const status = ref('Registro')
        const status_edit = ref('Registro')
        const id = ref(0)
        const toast = useToast()        
        const situacoes = ref(['Registro', 'Aguardando resposta', 'Teste Prático', 'Entrevista', 'Conclusão'])
        const confirm = useConfirm()

        return {
            showNew, hasErrors, hasEditErrors, vagas, empresa, empresa_edit, cargo, cargo_edit, responsavel, 
            responsavel_edit, status, status_edit, toast, showEdit, situacoes, id, confirm
        }
    },
    components: {
        "p-button": primevue.button,
        "p-message": primevue.message,
        "p-dialog": primevue.dialog,
        "p-inputtext": primevue.inputtext,
        "p-column": primevue.column,
        "p-datatable": primevue.datatable,
        "p-tag": primevue.tag,
        "p-toast": primevue.toast,
        "p-panel": primevue.panel,
        "p-dropdown": primevue.dropdown,
        "p-confirmdialog": primevue.confirmdialog
    },    
    methods: {
        save() {
            if(this.empresa.trim() === '' || this.cargo.trim() === '' || this.responsavel.trim() === '') {
                this.hasErrors = true
            }
            else {
                const storage = localStorage.getItem("vagas")                
                let index = 1
                if(storage !== null) {                    
                    index = JSON.parse(storage).length + 1
                }
                const vaga = {
                    id: index,
                    empresa: this.empresa,
                    cargo: this.cargo,
                    responsavel: this.responsavel,
                    status: this.status
                }
                this.vagas.push(vaga)
                localStorage.setItem("vagas", JSON.stringify(this.vagas))
                this.toast.add({ severity: "success", summary: "Mensagem", detail: "Vaga registrada com sucesso", life: 3000 })
                this.clearNewFields()
            }
        },
        edit(id) {
            this.showEdit = true
            const vagaEdit = this.vagas.find((vaga) => vaga.id === id)
            this.id = id
            this.empresa_edit = vagaEdit.empresa
            this.cargo_edit = vagaEdit.cargo
            this.responsavel_edit = vagaEdit.responsavel            
            this.status_edit = vagaEdit.status                    
        },
        update() {
            if(this.empresa_edit.trim() === '' || this.cargo_edit.trim() === '' || this.responsavel_edit.trim() === '' 
            || this.status_edit === '') {
                this.hasEditErrors = true
            }
            else {
                this.vagas.map(vaga => {
                    if(vaga.id === this.id) {
                        vaga.empresa = this.empresa_edit
                        vaga.cargo = this.cargo_edit
                        vaga.responsavel = this.responsavel_edit
                        vaga.status = this.status_edit
                        localStorage.setItem("vagas", JSON.stringify(this.vagas))
                        this.showEdit = false
                        this.toast.add({ severity: "info", summary: "Mensagem", detail: "Vaga atualizada com sucesso", life: 3000 })
                        this.clearEditFields()
                    }
                })
            }
        },
        clearNewFields() {
            this.empresa = ''
            this.cargo = ''
            this.responsavel = ''
            this.status = 'Registro'
            this.hasErrors = false
            this.showNew = false
        },
        clearEditFields() {
            this.id = 0
            this.empresa_edit = ''
            this.cargo_edit = ''
            this.responsavel_edit = ''
            this.status_edit = 'Registro'
            this.hasEditErrors = false
            this.showEdit = false
        },
        deleteRow(id) {
            this.confirm.require({
                message: 'Deseja realmente deletar esse registro?',
                header: 'Deletar Vaga',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                acceptLabel: 'Deletar',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.vagas = this.vagas.filter(vaga => vaga.id !== id)
                    localStorage.setItem("vagas", JSON.stringify(this.vagas))
                    this.toast.add({ severity: "error", summary: "Mensagem", detail: "Vaga deletada com sucesso", life: 3000 })
                },
                reject: () => {
                }
            });
        }
    },
    mounted() {
        const storage = localStorage.getItem("vagas")
        if(storage !== null) {
            this.vagas = JSON.parse(storage)
        }
    }
}

createApp(App)
    .use(primevue.config.default)
    .use(primevue.toastservice)
    .use(primevue.confirmationservice)
    .mount("#app")