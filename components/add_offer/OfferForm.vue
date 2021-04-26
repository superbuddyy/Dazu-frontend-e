<template>
  <div v-loading="processing" :class="[failShake ? 'add-offer-form' : 'shake add-offer-form']">
    <el-form
      v-if="!loading"
      ref="form"
      :model="form"
      :rules="rules"
      :label-position="labelPosition"
      label-width="120px"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Typ Ogłoszenia">
        <el-button type="plain" :class="[ form.attributes[1] === 'sprzedaz' ? 'active' : '' ]" @click="setType('sprzedaz')">
          Sprzedam
        </el-button>
        <el-button type="plain" :class="[ form.attributes[1] === 'wynajem' ? 'active' : '' ]" @click="setType('wynajem')">
          Wynajmę
        </el-button>
        <el-button type="plain" :class="[ form.attributes[1] === 'zamienie' ? 'active' : '' ]" @click="setType('zamienie')">
          Zamienię
        </el-button>
        <el-button type="plain" :class="[ form.attributes[1] === 'oddam' ? 'active' : '' ]" @click="setType('oddam')">
          Oddam
        </el-button>
      </el-form-item>
      <el-form-item label="Kategoria" prop="category">
        <el-select v-model="form.category" placeholder="Wybierz" clearable @change="setSubCategories">
          <el-option
            v-for="rootCategory in rootCategories"
            :key="rootCategory.value"
            :label="rootCategory.name"
            :value="rootCategory.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.category" label="Pod kategoria">
        <el-select v-model="form.subcategory" placeholder="Wybierz" clearable>
          <el-option
            v-for="subcategory in subcategories"
            :key="subcategory.value"
            :label="subcategory.name"
            :value="subcategory.value"
          />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="Cena" prop="price">
            <el-input
              v-model="formattedPrice"
              placeholder="0"
              name="price"
            >
              <template slot="append">
                zł
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="Cena za m2">
            <el-input
              v-model="formattedAttributePrice"
              placeholder="0"
            >
              <template slot="append">
                zł
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="">
          <el-checkbox
            v-model="form.attributes[2]"
          >
            {{ attributes['_2'].name }}
          </el-checkbox>
          <el-checkbox
            v-model="form.attributes[5]"
          >
            {{ attributes['_5'].name }}
          </el-checkbox>
          <el-checkbox
            v-model="form.attributes[6]"
          >
            {{ attributes['_6'].name }}
          </el-checkbox>
          <el-checkbox
            v-model="form.attributes[7]"
          >
            {{ attributes['_7'].name }}
          </el-checkbox>
          <el-checkbox
            v-model="form.attributes[8]"
          >
            {{ attributes['_8'].name }}
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="Metraż">
            <el-input v-model="form.attributes[4]" placeholder="0">
              <template slot="append">
                m<sup>2</sup>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Piętro">
            <el-select v-model="form.attributes[9]" placeholder="Wybierz" clearable>
              <el-option
                v-for="option in attributes['_9'].options"
                :key="option.id"
                :label="option.name"
                :value="option.slug"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Ilość pięter">
            <el-select v-model="form.attributes[10]" placeholder="Wybierz" clearable>
              <el-option
                v-for="option in attributes['_10'].options"
                :key="option.id"
                :label="option.name"
                :value="option.slug"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form-item label="Ilość pokojów">
                <el-select v-model="form.attributes[11]" placeholder="Wybierz" clearable>
                  <el-option
                    v-for="option in attributes['_11'].options"
                    :key="option.id"
                    :label="option.name"
                    :value="option.slug"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Stan">
                <el-select v-model="form.attributes[12]" placeholder="Wybierz" clearable>
                  <el-option
                    v-for="option in attributes['_12'].options"
                    :key="option.id"
                    :label="option.name"
                    :value="option.slug"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item label="Na Okres">
            <el-checkbox-group v-model="form.attributes[15]">
              <el-checkbox
                v-for="option in attributes['_15'].options"
                :key="option.id"
                :label="option.slug"
              >
                {{ option.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item label="Dodatkowe">
            <el-checkbox-group v-model="form.attributes[16]">
              <el-checkbox
                v-for="option in attributes['_16'].options"
                :key="option.id"
                :label="option.slug"
              >
                {{ option.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item label="Blisko">
            <el-checkbox-group v-model="form.attributes[17]">
              <el-checkbox
                v-for="option in attributes['_17'].options"
                :key="option.id"
                :label="option.slug"
              >
                {{ option.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Rok budowy">
            <el-select v-model="form.attributes[18]" placeholder="Wybierz" clearable>
              <el-option
                v-for="option in attributes['_18'].options"
                :key="option.id"
                :label="option.name"
                :value="option.slug"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Rynek">
            <el-select v-model="form.attributes[19]" placeholder="Wybierz" clearable>
              <el-option
                v-for="option in attributes['_19'].options"
                :key="option.id"
                :label="option.name"
                :value="option.slug"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Tytuł ogłoszenia" prop="title">
        <el-input v-model="form.title" placeholder="Wpisz" />
      </el-form-item>
      <el-form-item label="Opis" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="Link">
        <el-tooltip class="item" effect="dark" content="Każdy link jest płatny 1zł" placement="right">
          <el-input v-model="form.links.video" placeholder="do youtube, vimeo" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="Link">
        <el-tooltip class="item" effect="dark" content="Każdy link jest płatny 1zł" placement="right">
          <el-input v-model="form.links.video_2" placeholder="do youtube, vimeo" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="Link">
        <el-tooltip class="item" effect="dark" content="Każdy link jest płatny 1zł" placement="right">
          <el-input v-model="form.links.walk_video" placeholder="do wirtualnego spaceru" />
        </el-tooltip>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="Zdjęcia">
            <div class="photos-box">
              <Images
                :file-list="fileList"
                @on-change="handleChangeImages"
              />
            </div>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
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
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
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
      <div class="argent">
        <div class="argent-text">
          Spieszysz się? Aktywuj "<span>Pilne</span>"
        </div>
        <toggle-button
          v-model="form.attributes[20]"
          color="#009E79"
          :sync="true"
          :labels="{checked: 'Tak', unchecked: 'Nie'}"
        />
      </div>
      <div v-if="!$store.state.user.isLogged" class="contact-form">
        <el-form-item label="Jestem">
          <el-button type="plain" :class="[ form.user.account_type === 'private' ? 'active' : '' ]" @click="setUserType('private')">
            Osobą prywatną
          </el-button>
          <el-button type="plain" :class="[ form.user.account_type === 'agency' ? 'active' : '' ]" @click="setUserType('agency')">
            Agencją nieruchomości
          </el-button>
          <el-button type="plain" :class="[ form.user.account_type === 'developer' ? 'active' : '' ]" @click="setUserType('developer')">
            Deweloperem
          </el-button>
        </el-form-item>
        <el-form-item label="Imię" prop="user.name">
          <el-input v-model="form.user.name" placeholder="Imię" />
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
        <el-form-item v-if="['company', 'developer'].includes(form.user.account_type)" label="Wideo avatar">
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
        <el-form-item label="Imię">
          <el-input v-model="$store.state.user.name" placeholder="Imię" disabled />
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
        <el-button v-if="viewType === 'create'" type="primary" @click="onSubmit">
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
import { store, show, update } from '@/api/offer'
import { getLocation } from '@/api/osm'
import { mapOfferModelToOfferForm } from '@/helpers'
import { index } from '@/api/subscriptions'
import Images from '@/components/add_offer/Images'

export default {
  name: 'AddOfferForm',
  components: {
    Images
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
          account_type: 'private',
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
    getLatLon (location) {
      const coords = location.split('-')
      return [coords[0], coords[1]]
    },
    onSubmit () {
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
          this.addOffer()
        }
      })
    },
    setSubCategories (event) {
      this.form.subcategory = ''
      this.subcategories = this.categories[event]
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
    async addOffer () {
      const formData = this.makeFormData()
      try {
        const result = await store(formData)
        if (result.status === 201) {
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
            await this.$router.push('/moje-ogloszenia/oplac/' + result.data.offer_slug)
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
      const result = await update(this.offer.slug, formData)
      if (result.status === 200 && result.data.bill_amount !== undefined) {
        this.processing = false
        if (this.$store.state.user.isLogged) {
          await this.$router.push('/moje-ogloszenia/oplac/' + result.data.offer_slug)
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
      formData.append('links[video]', this.form.links.video)
      formData.append('links[video_2]', this.form.links.video_2)
      formData.append('links[walk_video]', this.form.links.walk_video)
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
      const form = mapOfferModelToOfferForm(offer, this.rootCategories, this.categories)
      this.setSubCategories(form.category)
      return form
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

  .argent {
    padding: 40px 0;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;

    .argent-text {
      margin-right: 20px;
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
