<template>
  <div
    v-loading="processing"
    :class="[failShake ? 'add-offer-form' : 'shake add-offer-form']"
  >
    <el-form
      v-if="!loading"
      ref="form"
      :model="form"
      :rules="rules"
      :label-position="labelPosition"
      label-width="120px"
      @submit.prevent="onSubmit"
    >
      <OfferTypeAttribute
        :type="form.attributes[1]"
        @set-type="setType"
      />
      <CategoryAttribute
        :category="form.category"
        :subcategory="form.subcategory"
        :root-categories="rootCategories"
        :root-sub-categories="rootSubCategories"
        @set-root-category="setCategory($event)"
        @set-sub-category="form.subcategory = $event"
      />
      <el-row>
        <el-col :span="11">
          <Attribute
            name="Cena"
            slug="price"
            placeholder="0"
            append-info="zł"
            :value="formattedPrice"
            @set-value="formattedPrice = $event"
          />
        </el-col>
        <el-col :span="11">
          <Attribute
            v-if="attributes['_3']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_3'].name"
            :slug="attributes['_3'].slug"
            placeholder="0"
            :append-info="attributes['_3'].unit"
            :value="formattedAttributePrice"
            @set-value="formattedAttributePrice = $event"
          />
        </el-col>
      </el-row>
      <el-row>
        <Attribute
          v-if="attributes['_2']['offer_types'].includes($store.state.addOfferForm.type)"
          :name="attributes['_2'].name"
          :slug="attributes['_2'].slug"
          :value="form.attributes[2]"
          type="checkbox"
          @set-value="form.attributes[2] = $event"
        />
        <Attribute
          v-if="attributes['_5']['offer_types'].includes($store.state.addOfferForm.type)"
          :name="attributes['_5'].name"
          :slug="attributes['_5'].slug"
          :value="form.attributes[5]"
          type="checkbox"
          @set-value="form.attributes[5] = $event"
        />
        <Attribute
          v-if="attributes['_6']['offer_types'].includes($store.state.addOfferForm.type)"
          :name="attributes['_6'].name"
          :slug="attributes['_6'].slug"
          :value="form.attributes[6]"
          type="checkbox"
          @set-value="form.attributes[6] = $event"
        />
        <Attribute
          v-if="attributes['_7']['offer_types'].includes($store.state.addOfferForm.type)"
          :name="attributes['_7'].name"
          :slug="attributes['_7'].slug"
          :value="form.attributes[7]"
          type="checkbox"
          @set-value="form.attributes[7] = $event"
        />
        <Attribute
          v-if="attributes['_8']['offer_types'].includes($store.state.addOfferForm.type)"
          :name="attributes['_8'].name"
          :slug="attributes['_8'].slug"
          :value="form.attributes[8]"
          type="checkbox"
          @set-value="form.attributes[8] = $event"
        />
      </el-row>
      <el-row>
        <el-col :span="6">
          <Attribute
            v-if="attributes['_4']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_4'].name"
            :slug="attributes['_4'].slug"
            :value="form.attributes[4]"
            :append-info="attributes['_4'].unit"
            @set-value="form.attributes[4] = $event"
          />
        </el-col>
        <el-col :span="6">
          <Attribute
            v-if="attributes['_9']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_9'].name"
            :slug="attributes['_9'].slug"
            :options="attributes['_9'].options"
            :value="form.attributes[9]"
            placeholder="Wybierz"
            type="select"
            @set-value="form.attributes[9] = $event"
          />
        </el-col>
        <el-col :span="6">
          <Attribute
            v-if="attributes['_10']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_10'].name"
            :slug="attributes['_10'].slug"
            :options="attributes['_10'].options"
            :value="form.attributes[10]"
            placeholder="Wybierz"
            type="select"
            @set-value="form.attributes[10] = $event"
          />
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <Attribute
                v-if="attributes['_11']['offer_types'].includes($store.state.addOfferForm.type)"
                :name="attributes['_11'].name"
                :slug="attributes['_11'].slug"
                :options="attributes['_11'].options"
                :value="form.attributes[11]"
                placeholder="Wybierz"
                type="select"
                @set-value="form.attributes[11] = $event"
              />
            </el-col>
            <el-col :span="6">
              <Attribute
                v-if="attributes['_12']['offer_types'].includes($store.state.addOfferForm.type)"
                :name="attributes['_12'].name"
                :slug="attributes['_12'].slug"
                :options="attributes['_12'].options"
                :value="form.attributes[12]"
                placeholder="Wybierz"
                type="select"
                @set-value="form.attributes[12] = $event"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <Attribute
            v-if="attributes['_15']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_15'].name"
            :slug="attributes['_15'].slug"
            :options="attributes['_15'].options"
            :value="form.attributes[15]"
            type="checkbox_group"
            @set-value="form.attributes[15] = $event"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12" :sm="24">
          <Attribute
            v-if="attributes['_16']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_16'].name"
            :slug="attributes['_16'].slug"
            :options="attributes['_16'].options"
            :value="form.attributes[16]"
            type="checkbox_group"
            @set-value="form.attributes[16] = $event"
          />
        </el-col>
        <el-col :md="12" :sm="24">
          <Attribute
            v-if="attributes['_17']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_17'].name"
            :slug="attributes['_17'].slug"
            :options="attributes['_17'].options"
            :value="form.attributes[17]"
            type="checkbox_group"
            @set-value="form.attributes[17] = $event"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <Attribute
            v-if="attributes['_18']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_18'].name"
            :slug="attributes['_18'].slug"
            :options="attributes['_18'].options"
            :value="form.attributes[18]"
            placeholder="Wybierz"
            type="select"
            @set-value="form.attributes[18] = $event"
          />
        </el-col>
        <el-col :span="12">
          <Attribute
            v-if="attributes['_19']['offer_types'].includes($store.state.addOfferForm.type)"
            :name="attributes['_19'].name"
            :slug="attributes['_19'].slug"
            :options="attributes['_19'].options"
            :value="form.attributes[19]"
            placeholder="Wybierz"
            type="select"
            @set-value="form.attributes[19] = $event"
          />
        </el-col>
      </el-row>
      <Attribute
        name="Tytuł"
        slug="title"
        :value="form.title"
        @set-value="form.title = $event"
      />
      <DescriptionAttribute
        :value="form.description"
        @set-value="form.description = $event"
      />
      <Attribute
        name="Link"
        slug="link"
        placeholder="do youtube, vimeo"
        :value="form.links.video"
        @set-value="form.links.video = $event"
      />
      <Attribute
        name="Link"
        slug="link"
        placeholder="do youtube, vimeo"
        :value="form.links.video_2"
        @set-value="form.links.video_2 = $event"
      />
      <Attribute
        name="Link"
        slug="link"
        placeholder="wirtualnego spaceru"
        :value="form.links.walk_video"
        @set-value="form.links.walk_video = $event"
      />
      <el-row>
        <el-col :span="24">
          <PhotoAttribute
            :file-list="fileList"
            @on-change="handleChangeImages"
          />
        </el-col>
      </el-row>
      <el-form-item label="Lokalizacja" prop="location">
        <el-select
          v-model="form.location"
          class="location-input"
          filterable
          remote
          placeholder="Podaj lokalizacje"
          :remote-method="getLocations"
          :loading="locationsLoading"
          :debounce="500"
          @change="showMap = true"
        >
          <el-option
            v-for="location in locations"
            :key="location.osm_id"
            :label="location.display_name"
            :value="location.lat + '-' + location.lon + '-' + location.display_name"
          />
        </el-select>
        <l-map
          v-if="showMap || viewType === 'update'"
          :zoom="zoom"
          :center="getLatLon(form.location)"
          class="map"
        >
          <l-tile-layer :url="mapStyle" />
          <l-marker
            ref="marker"
            :lat-lng="getLatLon(form.location)"
            :draggable="true"
            @dragend="changeLatLngAfterDrag"
          />
        </l-map>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="" class="visible-date">
            <div>Chcesz aby ogłoszenie pojawiło się w innym terminie?</div>
            <el-date-picker
              v-model="form.visibleFromDate"
              type="datetime"
              :picker-options="datePickerOptions"
              placeholder="Wybierz datę"
              format="yyyy/MM/dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="viewType === 'create'">
        <div class="container-account-types">
          <div
            v-for="subscription in subscriptions"
            :key="subscription.id"
            :class="[ selectedSubscription === subscription.id ? 'active sub-box' : 'sub-box' ]"
            @click="selectedSubscription = subscription.id"
          >
            <el-card class="card-box">
              <div class="card-body">
                <span>{{ subscription.name }}</span>
                <div class="bottom clearfix">
                  <div class="price">
                    <span>{{ subscription.price / 100 }}<sup>zł</sup></span>
                  </div>
                  <b>na {{ subscription.duration / 24 }} dni</b>
                  <div class="list">
                    <div v-for="item in subscription.description.split(';')" :key="item" class="list-item">
                      <i class="el-icon-arrow-down" />
                      {{ item }}
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-form-item>
      <div class="urgent">
        <div class="urgent-img">
          <img v-if="!form.attributes[20]" src="~/assets/house.svg" alt="">
          <img v-if="form.attributes[20]" src="~/assets/house_urgent.svg" alt="">
        </div>
        <div class="urgent-text">
          Spieszysz się? Aktywuj "<span>Pilne</span>"
        </div>
        <toggle-button
          v-model="form.attributes[20]"
          color="#009E79"
          :sync="true"
          :labels="{checked: 'Tak', unchecked: 'Nie'}"
        />
      </div>
      <div v-if="!$store.state.user.isLogged && viewType !== 'update'" class="contact-form">
        <el-form-item label="Jestem">
          <el-button type="plain" :class="[ form.user.account_type === 'user' ? 'active' : '' ]" @click="setUserType('user')">
            Osobą prywatną
          </el-button>
          <el-button type="plain" :class="[ form.user.account_type === 'agency' ? 'active' : '' ]" @click="setUserType('agency')">
            Agencją nieruchomości
          </el-button>
          <el-button type="plain" :class="[ form.user.account_type === 'developer' ? 'active' : '' ]" @click="setUserType('developer')">
            Deweloperem
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.user.account_type === 'user'" label="Imię" prop="user.name">
          <el-input v-model="form.user.name" placeholder="Imię" />
        </el-form-item>
        <el-form-item v-if="form.user.account_type !== 'user'" label="Nazwa Firmy" prop="user.name">
          <el-input v-model="form.user.name" placeholder="Nazwa Firmy" />
        </el-form-item>
        <el-row class="contact">
          <el-col :span="12">
            <el-form-item label="Numer telefonu">
              <el-input v-model="form.user.phone" placeholder="Numer telefonu" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email" prop="user.email">
              <el-input v-model="form.user.email" placeholder="Email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Avatar">
          <el-upload
            class="upload-demo"
            action="#"
            :on-remove="handleRemove"
            :on-change="handleChangeAvatar"
            :limit="1"
            :file-list="avatars"
          >
            <el-button size="small" type="primary">
              Kliknij aby dodać
            </el-button>
            <div slot="tip" class="el-upload__tip">
              Płatne 5zł ważne na 30dni
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="['agency', 'developer'].includes(form.user.account_type)" label="Wideo avatar">
          <el-input v-model="form.user.videoAvatar" type="text" placeholder="Link do filmu na YouTube" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Hasło" prop="user.password">
              <el-input v-model="form.user.password" type="password" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Potwórz hasło" prop="user.rePassword">
              <el-input v-model="form.user.rePassword" type="password" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="$store.state.user.isLogged" class="contact-form">
        <el-form-item label="Jestem">
          <el-button
            type="plain"
            :class="[ form.user.account_type === 'user' ? 'active' : '' ]"
            disabled
            @click="setUserType('user')"
          >
            Osobą prywatną
          </el-button>
          <el-button
            type="plain"
            :class="[ form.user.account_type === 'company' ? 'active' : '' ]"
            disabled
            @click="setUserType('company')"
          >
            Agencją nieruchomości
          </el-button>
          <el-button
            type="plain"
            :class="[ form.user.account_type === 'developer' ? 'active' : '' ]"
            disabled
            @click="setUserType('developer')"
          >
            Deweloperem
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.user.account_type === 'user'" label="Imię">
          <el-input v-model="$store.state.user.name" placeholder="Imię" disabled />
        </el-form-item>
        <el-form-item v-if="form.user.account_type !== 'user'" label="Nazwa Firmy">
          <el-input v-model="$store.state.user.name" placeholder="Nazwa Firmy" disabled />
        </el-form-item>
        <el-row class="contact">
          <el-col :span="12">
            <el-form-item label="Numer telefonu">
              <el-input v-model="$store.state.user.phone" placeholder="Numer telefonu" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input v-model="$store.state.user.email" placeholder="Email" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item class="add-btn">
        <el-button v-if="viewType === 'create'" type="primary" @click="onSubmit(true)">
          Podgląd
        </el-button>
        <el-button v-if="viewType === 'create'" type="primary" @click="onSubmit(false)">
          Dodaj ogłoszenie
        </el-button>
        <el-button v-if="viewType === 'update'" type="primary" @click="onSubmitEdit">
          Zapisz zmiany
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as Cookies from 'js-cookie'
import { store, show, update } from '@/api/offer'
import { getLocation } from '@/api/osm'
import { mapOfferModelToOfferForm } from '@/helpers'
import { index } from '@/api/subscriptions'
import OfferTypeAttribute from '@/components/add_offer/attributes/OfferTypeAttribute'
import Attribute from '@/components/add_offer/attributes/Attribute'
import CategoryAttribute from '@/components/add_offer/attributes/CategoryAttribute'
import PhotoAttribute from '@/components/add_offer/attributes/PhotoAttribute'
import DescriptionAttribute from '@/components/add_offer/attributes/DescriptionAttribute'

export default {
  name: 'AddOfferForm',
  components: {
    OfferTypeAttribute,
    Attribute,
    CategoryAttribute,
    PhotoAttribute,
    DescriptionAttribute
  },
  props: {
    attributes: {
      default () {
        return {}
      },
      type: Object
    },
    categories: {
      default () {
        return {}
      },
      type: Object
    },
    rootCategories: {
      default () {
        return []
      },
      type: Array
    },
    rootSubCategories: {
      default () {
        return []
      },
      type: Array
    },
    loading: {
      default: true,
      type: Boolean
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Wpisz hasło'))
      } else {
        if (this.form.password !== '') {
          this.$refs.form.validateField('rePassword')
        }
        callback()
      }
    }
    return {
      failShake: true,
      datePickerOptions: {
        disabledDate (date) {
          return date < new Date()
        }
      },
      avatars: [],
      subscriptions: [],
      selectedSubscription: 1,
      processing: false,
      viewType: 'create',
      zoom: 16,
      showMap: false,
      defaultLatLon: [0, 0],
      locations: [],
      locationsLoading: true,
      offer: {},
      form: {
        title: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        visibleFromDate: '',
        location: '',
        mainImage: [],
        images: [],
        user: {
          account_type: 'user',
          name: '',
          email: '',
          password: '',
          rePassword: '',
          avatar: '',
          videoAvatar: ''
        },
        links: {
          video: '',
          video_2: '',
          walk_video: ''
        },
        attributes: {
          1: 'sprzedaz',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: '',
          11: '',
          12: [],
          13: '',
          14: '',
          15: [],
          16: [],
          17: [],
          18: '',
          19: ''
        }
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      mainPhoto: [],
      marker: null,
      labelPosition: 'right',
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        category: { required: true, message: 'Kategoria jest wymagana', trigger: 'change' },
        price: [
          { required: true, message: 'Cena jest wymagana', trigger: 'change' }
        ],
        title: [
          { required: true, message: 'Tytuł jest wymagany', trigger: 'change' },
          { max: 70, message: 'Tytuł może miec maksymalie 70 znaków', trigger: 'change' }
        ],
        location: { required: true, message: 'Lokacja jest wymagana', trigger: 'change' },
        description: { required: true, message: 'Opis jest wymagany', trigger: 'change' },
        'user.email': { required: true, message: 'Email jest wymagany', trigger: 'change' },
        'user.password': { required: true, message: 'Hasło jest wymagane', trigger: 'change' },
        'user.rePassword': { required: true, message: 'Powtórz hasło jest wymagane', trigger: 'change' },
        'user.name': { required: true, message: 'Imię lub nazwa firmy jest wymagane', trigger: 'change' }
      }
    }
  },
  computed: {
    mapStyle () {
      return this.$config.mapStyle
    },
    formattedPrice: {
      get () {
        return this.form.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set (newValue) {
        this.form.price = newValue.replace(/\s/g, '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      }
    },
    formattedAttributePrice: {
      get () {
        return this.form.attributes[3].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set (newValue) {
        this.form.attributes[3] = newValue.replace(/\s/g, '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      }
    }
  },
  async mounted () {
    this.setType('sell')
    if (window.innerWidth < 700) {
      this.labelPosition = 'top'
    }
    await this.getSubscriptions()
    if ('option' in this.$route.query) {
      this.selectedSubscription = parseInt(this.$route.query.option)
    }
    if (this.$store.state.user.isLogged) {
      this.form.user.account_type = this.$store.state.user.roles[0]
    }
    if (this.$route.params.slug) {
      const result = await show(this.$route.params.slug, this.categories)
      if (result.status === 200) {
        this.viewType = 'update'
        this.offer = result.data
        this.form = this.fillForm(result.data)
        this.fileList = this.form.images
        this.locations = [{ lat: this.offer.location.lat, lon: this.offer.location.lon, display_name: this.offer.location.name }]
        this.form.location = this.offer.location.lat + '-' + this.offer.location.lon + '-' + this.offer.location.name
      }
    }
  },
  methods: {
    setCategory (e) {
      this.form.category = e
      if (this.viewType !== 'update') {
        this.form.subcategory = ''
      }
    },
    getLatLon (location) {
      const coords = location.split('-')
      return [coords[0], coords[1]]
    },
    onSubmit (preview) {
      this.processing = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.processing = false
          this.$message({
            message: 'Popraw formularz dodawania ogłoszenia',
            type: 'error',
            duration: 3000
          })
          return false
        } else {
          this.addOffer(preview)
        }
      })
    },
    changeLatLngAfterDrag (event) {
      const latLng = this.$refs.marker.mapObject.getLatLng()
      this.form.location = latLng.lat + '-' + latLng.lng + '-' + this.form.location[2]
    },
    async getLocations (locationName) {
      if (locationName !== '') {
        this.locationsLoading = true
        const locations = await getLocation(locationName)
        if (locations.data) {
          this.locationsLoading = false
          this.locations = locations.data.filter((item) => {
            return item.display_name.toLowerCase()
          })
        }
      } else {
        this.locations = []
      }
    },
    async addOffer (preview) {
      const formData = this.makeFormData()
      formData.append('preview', preview)
      try {
        const result = await store(formData)
        const offerSlug = result.data.offer_slug === undefined ? result.data.slug : result.data.offer_slug
        if (preview && (result.status === 200 || result.status === 201)) {
          Cookies.set('offer-token', result.data.offer_token, { expires: 1 })
          await this.$router.push('/ogloszenia/' + offerSlug + '?preview=true')
        } else if (result.status === 201) {
          this.$message({
            message: 'Dodano ogłoszenie',
            type: 'success',
            duration: 3000
          })
          this.processing = false
          await this.$router.push('/moje-ogloszenia')
        } else if (result.status === 200) {
          this.processing = false
          if (this.$store.state.user.isLogged) {
            await this.$router.push('/moje-ogloszenia/oplac/' + offerSlug)
          } else {
            this.$message({
              message: 'Na podany adres email został wysłany link do aktywacji konta i opłacenia ogłoszenia',
              type: 'success',
              duration: 3000
            })
            await this.$router.push('/')
          }
        }
      } catch (e) {
        this.processing = false
        this.failShake = true
        setTimeout(() => {
          this.failShake = false
        }, 1000)
      }
    },
    async onSubmitEdit () {
      this.processing = true
      const formData = this.makeFormData()
      // If user is not logged it send request with preview param.
      formData.append('preview', !this.$store.state.user.isLogged)
      const result = await update(this.offer.slug, formData)
      if (result.status === 200 && result.data.bill_amount !== undefined) {
        this.processing = false
        if (this.$store.state.user.isLogged) {
          await this.$router.push('/moje-ogloszenia/oplac/' + result.data.offer_slug)
        } else {
          this.$message({
            message: 'Na podany adres email został wysłany link do aktywacji konta i opłacenia ogłoszenia',
            type: 'success',
            duration: 3000
          })
          await this.$router.push('/')
        }
      } else if (result.status === 200) {
        this.$message({
          message: 'Ogłoszenie zaktualizowano',
          type: 'success',
          duration: 3000
        })
        await this.$router.push('/moje-ogloszenia')
      }
    },
    makeFormData () {
      const formData = new FormData()
      formData.append('title', this.form.title)
      formData.append('description', this.form.description)
      formData.append('price', parseInt(this.form.price.toString().replace(/\s/g, '')) * 100)

      const location = this.form.location.split('-')
      formData.append('lat', location[0])
      formData.append('lon', location[1])
      formData.append('location_name', location[2])
      if (this.form.links.video) {
        formData.append('links[video]', this.form.links.video)
      }
      if (this.form.links.video_2) {
        formData.append('links[video_2]', this.form.links.video_2)
      }
      if (this.form.links.walk_video) {
        formData.append('links[walk_video]', this.form.links.walk_video)
      }
      formData.append('visible_from_date', this.form.visibleFromDate)

      if (this.form.subcategory !== '') {
        formData.append('category', this.form.subcategory)
      } else {
        formData.append('category', this.form.category)
      }

      for (const attribute in this.form.attributes) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.form.attributes.hasOwnProperty(attribute) && this.form.attributes[attribute] !== '') {
          formData.append(`attributes[${attribute}]`, this.form.attributes[attribute])
        }
      }

      for (const image in this.form.images) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.form.images.hasOwnProperty(image)) {
          formData.append(`images[${image}]`, this.form.images[image].raw)
        }
      }

      if (!this.$store.state.user.isLogged) {
        formData.append('email', this.form.user.email)
        formData.append('password', this.form.user.password)
        formData.append('name', this.form.user.name)
        formData.append('phone', this.form.user.phone)
        formData.append('type', this.form.user.account_type)
        formData.append('avatar', this.form.user.avatar)
        formData.append('video_avatar', this.form.user.videoAvatar)
      }

      if (this.selectedSubscription) {
        formData.append('subscription', this.selectedSubscription)
      }

      return formData
    },
    setType (type) {
      this.form.attributes[1] = type
      this.$store.dispatch('addOfferForm/setType', type)
    },
    setUserType (type) {
      this.form.user.account_type = type
    },
    handleRemove (file) {
      //
    },
    handleChangeImages (files) {
      this.form.images = files
    },
    handleChangeAvatar (file) {
      this.form.user.avatar = file.raw
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      //
    },
    centerUpdate (center) {
      this.currentCenter = center
    },
    showLongText () {
      this.showParagraph = !this.showParagraph
    },
    fillForm (offer) {
      return mapOfferModelToOfferForm(offer, this.rootCategories, this.rootSubCategories)
    },
    async getSubscriptions () {
      const result = await index()
      this.subscriptions = result.data
    }
  }
}
</script>

<style lang="scss">
.add-offer-form {
  width: 100%;
  margin-top: 20px;

  .el-input__inner {
    color: #000000;
  }

  .el-row {
    display: flex;
    flex-wrap: wrap;
  }

  .el-col-6 {
    min-width: 270px;
  }

  .photos-box {
    display: flex;
    align-items: center;

    .drag-images {
      margin-top: 10px;
    }
  }

  .el-form-item__label {
    font-weight: bold;
  }

  .location-input {
    width: 100%;
  }

  .active {
    color: #ffffff !important;
    border-color: #ceefdd!important;
    background-color: #009e79 !important;
  }

  .contact {
    margin-top: 20px;
  }

  .map {
    margin-top: 10px;
    height: 340px;
  }

  .add-btn {
    margin-top: 30px;
    text-align: center;
  }

  .el-upload-list--picture-card {
    .el-upload-list__item-thumbnail {
      width: 100%;
      height: auto;
    }
  }

  .visible-date {
    display: flex;
    flex-direction: column;
  }

  .urgent {
    min-height: 160px;
    padding: 40px 0;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;

    .urgent-img {
      width: 137px;
      height: 100px;
    }

    .urgent-text {
      margin: 0 20px;
      span {
        color: red;
        font-weight: bold;
      }
    }
  }

  .container-account-types {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    background: #f5f5f5;
    padding: 10px 0;

    .sub-box {
      margin-bottom: 20px;
    }

    .active {
      box-shadow: 0 0 0 2pt #5dca8c;
    }

    .el-card__body {
      padding: 10px;

      .list {
        height: 72px;
        .list-item {
          i {
            font-weight: bold;
            color: #009E79;
          }
        }
      }

    }

    .card-box {
      width: 220px;
      height: 300px;
      cursor: pointer;

      .card-body {
        p {
          line-height: 24px;
        }
        .price {
          text-align: center;
          font-weight: bold;
          font-size: 36px;
          color: #009E79;
          padding: 10px;
          sup {
            font-size: 12px;
            color: #000000;
          }
        }
        span {
          text-transform: uppercase;
        }
        .bottom {
          text-align: center;
        }
      }
    }
  }
}
</style>
