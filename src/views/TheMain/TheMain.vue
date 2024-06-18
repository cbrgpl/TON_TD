<script lang="ts">
import ZInput from '@components/forms/ZInput.vue';
import ZTextrea from '@components/forms/ZTextrea.vue';
import ZButton from '@components/buttons/ZButton.vue';

import PStoreDistributionBtn from './partials/PStoreDistributionBtn.vue';
import PParsingDistributionBtn from './partials/PParsingDistributionBtn.vue';
import PStoreAndParsingDistributionBtn from './partials/PStoreAndParsingDistributionBtn.vue';

export default {
  name: 'TheMain',
  components: {
    ZInput,
    ZTextrea,
    ZButton,

    PStoreDistributionBtn,
    PParsingDistributionBtn,
    PStoreAndParsingDistributionBtn,
  },
};
</script>

<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import { useLogStore } from '@components/singletones/ZFeedBackPanel';
import { WalletsScanner, ChunkSizeStatisticsChecker } from '@/core/ton';

import type { UDistributionMethods } from './types';

const sessionWallet = ref<string | null>(null);
const transfersComment = ref<string | null>(null);

const logStore = useLogStore();

const walletsScanner = new WalletsScanner(null, logStore);
const chunkSizeChecker = new ChunkSizeStatisticsChecker(logStore);

provide('walletsScanner', walletsScanner);
provide('chunkSizeChecker', chunkSizeChecker);

// const transfersStatisticsStore = useTransfersStatisticsStore();

const activeDistributionMethod = ref<UDistributionMethods | null>(null);
const distributionFn = ref<(() => void) | null>(null);
watch(
  () => activeDistributionMethod.value,
  (activeDistributionMethod) => {
    console.log('activeDistributionMethod', activeDistributionMethod);
    if (activeDistributionMethod !== null) {
      if (distributionFn.value === null) {
        // eslint-disable-next-line no-console
        console.error(`distributionFn=null операция рассылки прервана для ${activeDistributionMethod}`);
        return;
      }

      distributionFn.value();
    } else {
      distributionFn.value = null;
      walletsScanner.offset = 0;
    }
  },
);
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
      <PStoreDistributionBtn
        class="main__action"
        on-aborting-classes="main__action--aborting"
        v-model:distributionMethod="activeDistributionMethod"
        @setStartingDistributionFn="distributionFn = $event"
      />
      <PParsingDistributionBtn
        class="main__action"
        on-aborting-classes="main__action--aborting"
        v-model:distributionMethod="activeDistributionMethod"
        @setStartingDistributionFn="distributionFn = $event"
      />
      <PStoreAndParsingDistributionBtn
        class="main__action"
        on-aborting-classes="main__action--aborting"
        v-model:distributionMethod="activeDistributionMethod"
        @setStartingDistributionFn="distributionFn = $event"
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

.main__action--aborting {
  color: var(--primary-active-color);
  border-color: var(--primary-active-color);
}

.main__action:last-child {
  margin-right: 0;
}
</style>
