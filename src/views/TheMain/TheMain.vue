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
import { provide, ref, watch, shallowRef, computed } from 'vue';

import { useLogStore } from '@components/singletones/ZFeedBackPanel';
import { WalletsScanner, ChunkSizeStatisticsChecker, createDistributor } from '@/core/ton';

import type { UDistributionMethods } from './types';

let distributor = shallowRef<Awaited<ReturnType<typeof createDistributor>> | null>(null);
const transfersMessage = ref<string>('');
const localStorageMessage = localStorage.getItem('message');
if (localStorageMessage) {
  transfersMessage.value = localStorageMessage;
}

const logStore = useLogStore();

const walletsScanner = new WalletsScanner(null, logStore);
const chunkSizeChecker = new ChunkSizeStatisticsChecker(logStore);

watch(
  () => [transfersMessage.value, distributor.value] as const,
  ([message]) => {
    if (distributor.value !== null) {
      distributor.value.message = message;
    }
  },
);

watch(
  () => transfersMessage.value,
  (message) => {
    localStorage.setItem('message', message ?? '');
  },
);

provide('walletsScanner', walletsScanner);
provide('chunkSizeChecker', chunkSizeChecker);
provide('distributor', distributor);

const activeDistributionMethod = ref<UDistributionMethods | null>(null);
const distributionFn = ref<(() => void) | null>(null);
watch(
  () => activeDistributionMethod.value,
  (activeDistributionMethod) => {
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

const englishWordRegExp = /^[a-zA-Z]+$/;
const mnemonicTmpValue = ref('');
const errorMessage = ref('');
const mnemonicTouched = ref(false);
const validateMnemonic = () => {
  errorMessage.value = '';

  const words = mnemonicTmpValue.value.split(' ').filter((value) => value !== '');
  let wrongWord = null as null | string;
  if (words.length !== 24) {
    errorMessage.value = 'Количество слов не равно 24';
  } else if (
    words.some((word) => {
      if (!englishWordRegExp.test(word)) {
        wrongWord = word;
        return true;
      }
    })
  ) {
    errorMessage.value = `В слове "${wrongWord}" присутствуют символы не являющиеся английской буквой`;
  }
};
watch(
  () => [mnemonicTmpValue.value, mnemonicTouched.value],
  () => {
    if (mnemonicTouched.value) {
      validateMnemonic();
    }
  },
);
const submitMnemonic = async () => {
  mnemonicTouched.value = true;

  if (errorMessage.value) {
    return;
  }

  localStorage.setItem('mnemonic', mnemonicTmpValue.value);
  if (distributor.value) {
    distributor.value.desctruct();
  }
  distributor.value = await createDistributor(mnemonicTmpValue.value, logStore);
};

const storageMnemonic = localStorage.getItem('mnemonic');

if (storageMnemonic) {
  mnemonicTmpValue.value = storageMnemonic;
  submitMnemonic();
}

const prettyBalance = computed(() => {
  if (!distributor.value) {
    return '';
  }
  const stringifiedBalance = distributor.value?.balance.value.toString();

  let integerPart = stringifiedBalance.slice(0, -9) || '0';
  const decimalPart = stringifiedBalance.slice(-9).replace(/0+$/, '');

  return `${integerPart}${decimalPart !== '' ? ',' + decimalPart : ''}`;
});
</script>

<template>
  <section class="main">
    <div class="main__mnemonic-field-wrapper">
      <ZTextrea
        v-model="mnemonicTmpValue"
        class="main__mnemonic-field"
        label="Волшебная фраза[mnemonic]"
      />
      <div class="main__mnemonic-actions-wrapper">
        <div
          v-show="errorMessage"
          class="main__mnemonic-error"
        >
          {{ errorMessage }}
        </div>
        <ZButton
          class="main__mnemonic-btn"
          @click="submitMnemonic"
          title="Подтверждает ввод волшебной фразы"
          >Подтвердить</ZButton
        >
      </div>
    </div>
    <ZTextrea
      v-model="transfersMessage"
      class="main__input"
      label="Комментарий к транзакции"
    />

    <div class="main__actions">
      <PStoreDistributionBtn
        class="main__action"
        on-aborting-classes="main__action--aborting"
        :disabled="distributor === null || !transfersMessage"
        v-model:distributionMethod="activeDistributionMethod"
        @setStartingDistributionFn="distributionFn = $event"
      />
      <PParsingDistributionBtn
        class="main__action"
        on-aborting-classes="main__action--aborting"
        :disabled="distributor === null || !transfersMessage"
        v-model:distributionMethod="activeDistributionMethod"
        @setStartingDistributionFn="distributionFn = $event"
      />
      <PStoreAndParsingDistributionBtn
        class="main__action"
        on-aborting-classes="main__action--aborting"
        :disabled="distributor === null || !transfersMessage"
        v-model:distributionMethod="activeDistributionMethod"
        @setStartingDistributionFn="distributionFn = $event"
      />
    </div>

    <div v-if="distributor !== null">
      <h5>Активная волшенбная фраза[mnemonic]: {{ distributor.mnemonic }}</h5>
      <h5>Адресс: {{ distributor.address }}</h5>
      <h5>Баланс: {{ prettyBalance }}</h5>
    </div>
  </section>
</template>

<style scoped>
.main {
  width: 40rem;
  margin: auto;

  padding: 2rem 1rem;
}

.main__input {
  margin-bottom: 1rem;
}

.main__mnemonic-error {
  color: var(--danger-color);
  margin-bottom: 0.25rem;
}

.main__input:last-child {
  margin-bottom: 0;
}

.main__mnemonic-field-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 5rem;
}

.main__mnemonic-field {
  width: 100%;
  margin-bottom: 0.5rem;
}

.main__mnemonic-actions-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main__mnemonic-btn {
  height: 1.5625rem;
  margin-left: auto;
}

.main__mnemonic-field-wrapper > *:first-child {
  margin-right: 0.5rem;
}

.main__actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
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
