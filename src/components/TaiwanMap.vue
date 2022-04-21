<template>
    <div>
        <svg id="twMap" data-name="tw-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
            <path class="county-path"
                  v-for="path in TaiwanSvgPath.single"
                  :key="path.enCity"
                  :id="path.enCity"
                  :data-name="path.enCity"
                  :d="path.path"
                  :class="[{'active': path.enCity == currentSelectCounty}]"
                  @click="selectCounty(path.enCity, path.zhCity)"/>
            <g v-for="path in TaiwanSvgPath.group"
               :key="path.enCity"
               class="county-path"
               :class="[{'active': path.enCity == currentSelectCounty}]"
               @click="selectCounty(path.enCity, path.zhCity)">
                <path v-for="i in path.path.length"
                      :key="i"
                      :id="`path.enCity + ${i}`"
                      :data-name="`path.enCity + ${i}`"
                      :d="path.path[i - 1]"/>
            </g>
        </svg>
    </div>
</template>

<script>
    import TaiwanSvgPath from './TaiwanSvgPath'

    export default {
        name: "TaiwanMap",
        props: {
            currentCounty: String
        },
        data() {
            return {
                TaiwanSvgPath,
                currentSelectCounty: 'taipei'
            }
        },
        methods: {
            selectCounty(enCountyName, zhCountyName) {
                this.currentSelectCounty = enCountyName;
                this.$emit('update:currentCounty', zhCountyName)
            }
        }
    }
</script>

<style scoped lang="scss">
    svg{
        height: calc(100vh - 48.4px);
        .county-path{
            stroke:     whitesmoke;
            fill:       transparent;
            transition: 0.25s;
            cursor:     pointer;
            &:hover path, &:hover{
                fill:      rgba(155, 193, 188, 0.8);
                transform: translate(-5px, -5px)
            }
            &.active{
                fill:      #9BC1BC;
                transform: translate(-5px, -5px)
            }
        }
        @media (max-width: 768px){
            height: initial;
        }
    }
</style>