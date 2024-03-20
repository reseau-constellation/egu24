<template>
  <v-sheet
   width="100%"
   :height="hauteur"
   class="text-center mb-2"
  >
    <div class="text-center">
      <div v-show="assezDeDonnées" ref="resizeRef" class="ma-6">
        <svg ref="svgRef" width="100%">
          <g class="x-axis" />
          <g class="y-axis" />
        </svg>
      </div>
      <v-card
        v-show="!assezDeDonnées"
        class="d-flex align-center text-center"
        variant="flat"
        :height="hauteur"
      >
        <v-card-text>
            <div class="mx-auto text-h6 text-center text-disabled">
                {{ t("démo.graphique.aucuneDonnée") }}
            </div>
        </v-card-text>  
      </v-card>
    </div>
  </v-sheet>
</template>
<script setup lang="ts">
import {
  type Ref,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from "vue";
import {
  axisBottom,
  axisLeft,
  line,
  max,
  scaleLinear,
  scaleTime,
  select,
  extent,
  curveBasis,
} from "d3";
import { computed } from "vue";
import {
  எண்களைப்_பயன்படுத்து,
  கிளிமூக்கை_பயன்படுத்து,
} from "@lassi-js/kilimukku-vue";

const props = defineProps<{
  hauteur: number;
  vals?: { date: number; précip: number }[];
}>();

const { எண்ணை_வடிவூட்டு } = எண்களைப்_பயன்படுத்து();
const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து();

const données = computed(() =>
  (props.vals || []).map((x) => ({
    date: new Date(x.date),
    value: x.précip,
  })),
);
const svgRef = ref(null);

const assezDeDonnées = computed(() => {
  return !!données.value.length;
});

const formatteurs: { [chiffre: string]: Ref<string> } = {};

const formatterChiffre = (x: number): string => {
  if (!formatteurs[x.toString()]) {
    formatteurs[x.toString()] = எண்ணை_வடிவூட்டு(x);
  }
  return formatteurs[x.toString()].value;
};

// https://dev.to/muratkemaldar/using-vue-3-with-d3-composition-api-3h1g
// https://stackoverflow.com/questions/28609929/how-to-display-second-y-axis-to-right-of-grouped-bar-chart-data-in-d3
onMounted(() => {
  const svg = select(svgRef.value);

  watchEffect(() => {
    const { width, height } = resizeState.dimensions;
    if (!(width && height)) return;

    const x = scaleTime()
      .domain(extent(données.value, (d) => d.date) as [Date, Date]) // input values...
      .range([0, width]); // ... output values

    const y = scaleLinear()
      .domain([0, max(données.value, (d) => d.value)] as [number, number]) // input values...
      .range([height, 0]); // ... output values

    svg
      .selectAll<SVGSVGElement, unknown>(".line") // get all "existing" lines in svg
      .data([données.value]) // sync them with our data
      .join("path")

      // everything after .join() is applied to every "new" and "existing" element
      .attr("class", "line") // attach class (important for updating)

      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        line<{ date: Date; value: number }>()
          .x((d: { date: Date; value: number }) => x(d.date))
          .y((d: { date: Date; value: number }) => y(d.value))
          .curve(curveBasis),
      );

    // render axes with help of scales
    // (we let Vue render our axis-containers and let D3 populate the elements inside it)
    const xAxis = axisBottom(x);

    svg
      .select<SVGSVGElement>(".x-axis")
      .style("transform", `translateY(${height}px)`) // position on the bottom
      .call(xAxis)
      .append("text");

    const yAxis = axisLeft(y);

    yAxis.tickFormat((x) => formatterChiffre(x.valueOf()));
    svg.select<SVGSVGElement>(".y-axis").call(yAxis);
  });
});

const useResizeObserver = () => {
  // create a new ref,
  // which needs to be attached to an element in a template
  const resizeRef = ref();
  const resizeState = reactive<{
    dimensions: { width?: number; height?: number };
  }>({
    dimensions: {},
  });

  const observer = new ResizeObserver((entries) => {
    // called initially and on resize
    entries.forEach((entry) => {
      resizeState.dimensions = entry.contentRect;
    });
  });

  onMounted(() => {
    // set initial dimensions right before observing: Element.getBoundingClientRect()
    resizeState.dimensions = resizeRef.value.getBoundingClientRect();
    observer.observe(resizeRef.value);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value);
  });

  // return to make them available to whoever consumes this hook
  return { resizeState, resizeRef };
};
const { resizeRef, resizeState } = useResizeObserver();


</script>
<style scoped>
svg {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
