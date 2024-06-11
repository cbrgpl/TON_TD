<script lang="ts">
import ZInput from '@components/forms/ZInput.vue';
import ZTextrea from '@components/forms/ZTextrea.vue';
import ZButton from '@components/buttons/ZButton.vue';

export default {
  name: 'TheMain',
  components: {
    ZInput,
    ZTextrea,
    ZButton,
  },
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { LoremIpsum } from 'lorem-ipsum';
import { useLogStore, useTransfersStatisticsStore } from '@components/singletones/ZFeedBackPanel';

const sessionWallet = ref<string | null>(null);
const transfersComment = ref<string | null>(null);

const logStore = useLogStore();
const transfersStatisticsStore = useTransfersStatisticsStore();

// const distributionEnabled = ref(false);

const lorem = new LoremIpsum();
const test = () => {
  const seed = 15 + Math.floor(Math.random() * 100);

  const logTypesDict = {
    0: 'error',
    1: 'warn',
    2: 'message',
  };
  const logType = logTypesDict[seed % 3];
  const logContent = lorem.generateWords(seed % 30);

  const statisticsContainer = {
    successful: seed % 10,
    failed: seed % 2,
  };

  logStore.log({
    content: logContent,
    type: logType,
  });

  transfersStatisticsStore.updateStatistics(statisticsContainer);
};
</script>

<template>
  <section class="main">
    <ZInput
      class="main__input"
      v-model="sessionWallet"
      label="Адрес кошелька"
    />
    <ZTextrea
      v-model="transfersComment"
      class="main__input"
      label="Комментарий к транзакции"
    />

    <div class="main__actions">
      <ZButton
        class="main__action"
        @click="test"
        icon="database"
        tip="Из хранилища"
      />
      <ZButton
        class="main__action"
        icon="network"
        tip="Из парсера"
      />
      <ZButton
        class="main__action"
        icon="branchesOutline"
        tip="Из хранилища и парсера"
      />
      <ZButton
        class="main__action main__abort-distribution-button"
        icon="error"
        variant="danger"
        tip="Из хранилища и парсера"
      />
    </div>
  </section>
</template>

<style scoped>
.main {
  width: 40rem;
  margin: auto;

  padding: 2rem 0;
}

.main__input {
  margin-bottom: 1rem;
}

.main__input:last-child {
  margin-bottom: 0;
}

.main__actions {
  display: flex;
}

.main__action {
  margin-right: 1rem;
}

.main__action:last-child {
  margin-right: 0;
}

.main__abort-distribution-button {
  margin-left: auto;
}
</style>
