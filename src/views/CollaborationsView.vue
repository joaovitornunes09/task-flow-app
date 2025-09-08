<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import CollaborationCard from '@/components/CollaborationCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { UsersIcon, Loader2Icon } from 'lucide-vue-next'
import { useCollaborations } from '@/composables/useCollaborations'

const { loading, collaborations, loadCollaborations } = useCollaborations()

onMounted(() => {
  loadCollaborations()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Minhas Colaborações</h1>
          <p class="mt-2 text-gray-600 text-sm sm:text-base">Tarefas onde você é colaborador ou tem permissões especiais</p>
        </div>

        <div class="flex gap-3">
          <Button variant="outline" size="sm" @click="loadCollaborations" class="flex-shrink-0">
            <UsersIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Atualizar</span>
            <span class="sm:hidden">Atualizar</span>
          </Button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader2Icon class="h-8 w-8 animate-spin text-primary mx-auto" />
        <p class="mt-4 text-gray-500">Carregando colaborações...</p>
      </div>

      <div v-else-if="collaborations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <CollaborationCard 
          v-for="collaboration in collaborations" 
          :key="collaboration.id"
          :collaboration="collaboration"
        />
      </div>

      <EmptyState
        v-else
        :icon="UsersIcon"
        title="Nenhuma colaboração encontrada"
        description="Você ainda não está colaborando em nenhuma tarefa."
      >
        Você ainda não está colaborando em nenhuma tarefa.
        <br>Aguarde ser convidado para tarefas ou peça para ser adicionado como colaborador.
      </EmptyState>
    </div>
  </AppLayout>
</template>
