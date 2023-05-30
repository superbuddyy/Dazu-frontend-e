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
        :category.sync="form.category"
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
            append-info="zloty"
            inputType="text"
            inputMode="numeric"
            :disabled="(form.attributes[1] == 'sell' || form.attributes[1] == 'rent')? false : form.attributes[8]"
            :value="formattedPrice"
            @set-value="formattedPrice = $event"
          />
        </el-col>
        <el-col :span="11">
          <Attribute
            v-if="attributes['_3']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_3'].name"
            :slug="attributes['_3'].slug"
            placeholder="0"
            :append-info="attributes['_3'].unit"
            :value="formattedAttributePrice"
            inputType="text"
            inputMode="numeric"
            @set-value="formattedAttributePrice = $event"
          />
        </el-col>
        <el-col :span="11">
          <Attribute
            v-if="attributes['_21']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_21'].name"
            :slug="attributes['_21'].slug"
            placeholder="0"
            :append-info="attributes['_21'].unit"
            :value="formattedAttribute21Price"
            inputType="text"
            inputMode="numeric"
            @set-value="formattedAttribute21Price = $event"
          />
        </el-col>
      </el-row>
      <el-row>
        <Attribute
          v-if="attributes['_2']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_2'].name"
          :slug="attributes['_2'].slug"
          :value="form.attributes[2]"
          type="checkbox"
          @set-value="form.attributes[2] = $event"
        />
        <Attribute
          v-if="attributes['_5']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_5'].name"
          :slug="attributes['_5'].slug"
          :value="form.attributes[5]"
          type="checkbox"
          @set-value="form.attributes[5] = $event"
        />
        <Attribute
          v-if="attributes['_22']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_22'].name"
          :slug="attributes['_22'].slug"
          :value="form.attributes[22]"
          type="checkbox"
          @set-value="form.attributes[22] = $event"
        />
        <Attribute
          v-if="attributes['_23']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_23'].name"
          :slug="attributes['_23'].slug"
          :value="form.attributes[23]"
          type="checkbox"
          @set-value="form.attributes[23] = $event"
        />
        <Attribute
          v-if="attributes['_6']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_6'].name"
          :slug="attributes['_6'].slug"
          :value="form.attributes[6]"
          type="checkbox"
          @set-value="form.attributes[6] = $event"
        />
        <Attribute
          v-if="attributes['_7']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_7'].name"
          :slug="attributes['_7'].slug"
          :value="form.attributes[7]"
          type="checkbox"
          @set-value="form.attributes[7] = $event"
        />
        <Attribute
          v-if="attributes['_8']['offer_types'].includes(addOfferForm.type)"
          :name="attributes['_8'].name"
          :slug="attributes['_8'].slug"
          :value="form.attributes[8]"
          type="checkbox"
          @set-value="form.attributes[8] = $event"
        />
        <Attribute
          v-if="addOfferForm.type === 'sell'"
          :name="'New Build'"
          :slug="'new-build'"
          :value="form.attributes[38]"
          type="checkbox"
          @set-value="form.attributes[38] = $event"
        />
      </el-row>
      <el-row v-if="addOfferForm.type === 'sell'">
        <el-col :span="4">
          <Attribute
            :name="'Chain-free'"
            :slug="'chain-free'"
            :value="form.attributes[39]"
            type="checkbox"
            @set-value="form.attributes[39] = $event"
          />
          <Attribute
            :name="'Shared ownership'"
            :slug="'shared-ownership'"
            :value="form.attributes[40]"
            type="checkbox"
            @set-value="form.attributes[40] = $event"
          />
          <Attribute
            :name="'Help to buy'"
            :slug="'help-to-buy'"
            :value="form.attributes[41]"
            type="checkbox"
            @set-value="form.attributes[41] = $event"
          />
        </el-col>
        <el-col :span="4">
          <Attribute
            :name="'Leashold'"
            :slug="'leashold'"
            :value="form.attributes[42]"
            type="checkbox"
            @set-value="form.attributes[42] = $event"
          />
          <Attribute
            :name="'Freehold'"
            :slug="'freehold'"
            :value="form.attributes[43]"
            type="checkbox"
            @set-value="form.attributes[43] = $event"
          />
        </el-col>
      </el-row>
      <Attribute
        v-if="addOfferForm.type === 'sell'"
        :name="'Energy and environment'"
        :slug="'energy-and-environment'"
        :value="form.attributes[44]"
        :options="form.energyOption"
        type="checkbox_group"
        :direction="'row'"
        @set-value="form.attributes[44] = $event"
      />
      <div v-if="addOfferForm.type === 'rent'">
        <Attribute
          :name="'Landlord live-out'"
          :slug="'landlord-live-out'"
          :value="form.attributes[29]"
          type="checkbox"
          @set-value="form.attributes[29] = $event"
        />
        <Attribute
          :name="'En-suite or own bathroom'"
          :slug="'en-suite-or-own-bathroom'"
          :value="form.attributes[30]"
          type="checkbox"
          @set-value="form.attributes[30] = $event"
        />
        <Attribute
          :name="'LGBT friendly'"
          :slug="'lgbt-friendly'"
          :value="form.attributes[31]"
          type="checkbox"
          @set-value="form.attributes[31] = $event"
        />
        <Attribute
          :name="'Vegan/Vegatarian'"
          :slug="'vegan-vegatarian'"
          :value="form.attributes[32]"
          type="checkbox"
          @set-value="form.attributes[32] = $event"
        />
        <Attribute
          :name="'Smoking OK'"
          :slug="'smoking-ok'"
          :value="form.attributes[33]"
          :options="form.smokingOption"
          type="radio_group"
          :direction="'row'"
          @set-value="form.attributes[33] = $event"
        />
        <Attribute
          :name="'Pets Friendly'"
          :slug="'pets-friendly'"
          :value="form.attributes[34]"
          :options="form.petsOption"
          type="radio_group"
          :direction="'row'"
          @set-value="form.attributes[34] = $event"
        />
        <Attribute
          :name="'Available for'"
          :slug="'available-for'"
          :value="form.attributes[35]"
          :options="form.availableForOption"
          type="checkbox_group"
          :direction="'row'"
          @set-value="form.attributes[35] = $event"
        />
        <Attribute
          :name="''"
          :slug="''"
          :value="form.attributes[36]"
          :options="form.genderOption"
          type="radio_group"
          :direction="'row'"
          @set-value="form.attributes[36] = $event"
        />
        <el-row>
          <el-col :span="4">
            <Attribute
              :name="'Available Now'"
              :slug="'available-now'"
              :value="form.attributes[37]"
              type="switch"
              @set-value="form.attributes[37] = $event"
            />
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="form.availableNow"
              type="datetime"
              :picker-options="datePickerOptions"
              placeholder="Select a date"
              format="yyyy/MM/dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              v-bind:disabled="form.attributes[37]"
            />
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="6">
          <Attribute
            v-if="attributes['_4']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_4'].name"
            :slug="attributes['_4'].slug"
            :value="form.attributes[4]"
            :append-info="attributes['_4'].unit"
            inputType="number"
            @set-value="form.attributes[4] = $event"
          />
        </el-col>
        <el-col :span="6">
          <Attribute
            v-if="attributes['_9']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_9'].name"
            :slug="attributes['_9'].slug"
            :options="attributes['_9'].options"
            :value="form.attributes[9]"
            placeholder="Choose"
            type="select"
            @set-value="form.attributes[9] = $event"
          />
        </el-col>
        <el-col :span="6">
          <Attribute
            v-if="attributes['_10']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_10'].name"
            :slug="attributes['_10'].slug"
            :options="attributes['_10'].options"
            :value="form.attributes[10]"
            placeholder="Choose"
            type="select"
            @set-value="form.attributes[10] = $event"
          />
        </el-col>
        <el-col :span="6"/>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <Attribute
                v-if="attributes['_11']['offer_types'].includes(addOfferForm.type)"
                :name="attributes['_11'].name"
                :slug="attributes['_11'].slug"
                :options="attributes['_11'].options"
                :value="form.attributes[11]"
                placeholder="Choose"
                type="select"
                @set-value="form.attributes[11] = $event"
              />
            </el-col>
            <el-col :span="6">
              <Attribute
                v-if="attributes['_12']['offer_types'].includes(addOfferForm.type)"
                :name="attributes['_12'].name"
                :slug="attributes['_12'].slug"
                :options="attributes['_12'].options"
                :value="form.attributes[12]"
                placeholder="Choose"
                type="select"
                @set-value="form.attributes[12] = $event"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="13">
          <Attribute
            v-if="attributes['_15']['offer_types'].includes(addOfferForm.type)"
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
            v-if="attributes['_16']['offer_types'].includes(addOfferForm.type)"
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
            v-if="attributes['_17']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_17'].name"
            :slug="attributes['_17'].slug"
            :options="attributes['_17'].options"
            :value="form.attributes[17]"
            type="checkbox_group"
            @set-value="form.attributes[17] = $event"
          />
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <Attribute
            v-if="attributes['_18']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_18'].name"
            :slug="attributes['_18'].slug"
            :options="attributes['_18'].options"
            :value="form.attributes[18]"
            placeholder="Choose"
            type="select"
            @set-value="form.attributes[18] = $event"
          />
        </el-col>
        <el-col :span="12">
          <Attribute
            v-if="attributes['_19']['offer_types'].includes(addOfferForm.type)"
            :name="attributes['_19'].name"
            :slug="attributes['_19'].slug"
            :options="attributes['_19'].options"
            :value="form.attributes[19]"
            placeholder="Choose"
            type="select"
            @set-value="form.attributes[19] = $event"
          />
        </el-col>
      </el-row> -->
      <Attribute
        name="Title"
        slug="title"
        :value="form.title"
        @set-value="form.title = $event"
      />
      <DescriptionAttribute
        :value="form.description"
        @set-value="setDescValue"
      />
      <el-row class="fw-bld">
        <el-col :span="24">
          <el-form-item>
            <span class="_error">ATTENTION!</span> To add a video or a 3D walk, please use the copied links from "share" and not from the address bar - more at
            <a
              href="/faq"
              target="_blank"
              class="bld"
            >
              FAQ
            </a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tooltip :content="linkLimitMsg" placement="top">
        <Attribute
          name="Link"
          slug="links.video"
          placeholder="do youtube, vimeo"
          :value="formattedVideo"
          @set-value="formattedVideo = $event"
        />
      </el-tooltip>
      <el-tooltip :content="linkLimitMsg" placement="top">
        <Attribute
          name="Link"
          slug="links.video_2"
          placeholder="do youtube, vimeo"
          :value="formattedVideo2"
          @set-value="formattedVideo2 = $event"
        />
      </el-tooltip>
      <el-tooltip :content="linkLimitMsg" placement="top">
        <Attribute
          name="Link"
          slug="links.walk_video"
          placeholder="virtual walk"
          :value="formattedWalkVideo"
          @set-value="formattedWalkVideo = $event"
        />
      </el-tooltip>
      <el-row>
        <el-col :span="24">
          <PhotoAttribute
            fileLabel="Photos"
            :file-list="fileList"
            @on-change="handleChangeImages"
          />
        </el-col>
      </el-row>
      <el-row class="el-form-item__error" v-if="isPhotoLimitReached === true">
        <el-col :span="24">
          <el-form-item>
            {{photoLimitMsg}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <PhotoAttribute
            fileLabel="Photos..."
            :file-list="projectFileList"
            :limit="2"
            :isProjectPlan="true"
            @on-change="handleChangeProjectImages"
          />
        </el-col>
      </el-row>
      <el-form-item label="Location" prop="location">
        <el-select
          v-model="form.location"
          class="location-input"
          filterable
          remote
          placeholder="Provide locations"
          :remote-method="getLocations"
          :loading="locationsLoading"
          :debounce="500"
          @change="showMap = true"
        >
          <el-option
            v-for="location in locations"
            :key="location.osm_id"
            :label="location.display_name"
            :value="location.lat + '*' + location.lon + '*' + location.display_name"
          />
        </el-select>
        <l-map
          v-if="showMap || viewType === 'update'"
          :zoom="zoom"
          :center="getLatLon(form.location)"
          class="map"
        >
          <l-tile-layer :url="mapStyle"/>
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
            <div>Do you want the ad to appear at a different date?</div>
            <div v-if="dateLimitMsg !== ''" class="el-form-item__error">{{dateLimitMsg}}</div>
            <el-date-picker
              v-model="form.visibleFromDate"
              type="datetime"
              :picker-options="datePickerOptions"
              placeholder="Select a date"
              format="yyyy/MM/dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="viewType === 'create' || viewType === 'preview'" label-width="0px">
        <div class="container-account-types">
          <div
            v-for="(subscription, index) in subscriptions"
            :key="subscription.id"
            :class="[ selectedSubscription === subscription.id ? 'active sub-box' : 'sub-box' ]"
            @click="selectPackage(subscription.id)"
          >
            <el-card :class="[`card-box subscription-box-${index}`]">
              <div class="card-body">
                <div class="subscription-header">{{ subscription.name }}</div>
                <div class="bottom clearfix">
                  <div class="price">
                    <span>{{ subscription.price / 100 }} <sup> zloty</sup></span>
                  </div>
                  <b>na {{ subscription.duration / 24 }} dni</b>
                  <div class="list subscription-options">
                    <div
                      v-if="
                        (subscription.number_of_raises !== 0 && subscription.number_of_raises !== '0')
                          || (subscription.number_of_refreshes !== 0 && subscription.number_of_refreshes !== '0')
                      "
                      class="starred"
                    >
                      <div v-if="subscription.number_of_raises !== 0 && subscription.number_of_raises !== '0'" class="list-item">
                        <i class="el-icon-star-on"/> {{ subscription.number_of_raises }}
                        <span v-if='subscription.number_of_raises === 1'>free raise</span>
                        <span v-else-if='subscription.number_of_raises > 1 && subscription.number_of_refreshes < 5'>free raises</span>
                        <span v-else-if='subscription.number_of_raises >= 5'>free raises</span>
                      </div>
                      <div v-if="subscription.number_of_refreshes !== 0 && subscription.number_of_refreshes !== '0'" class="list-item">
                        <i class="el-icon-star-on"/> {{ subscription.number_of_refreshes }}
                        <span v-if='subscription.number_of_refreshes === 1'>free refresh</span>
                        <span v-else-if='subscription.number_of_refreshes > 1 && subscription.number_of_refreshes < 5'>free refreshes</span>
                        <span v-else-if='subscription.number_of_refreshes >= 5'>free refreshes</span>
                      </div>
                      <div class="list-item" v-if="subscription.featured_on_search_results_and_categories === true">
                        <i class="el-icon-star-on"/> featured in a moving gallery in search results and categories
                      </div>
                      <div class="list-item" v-if="subscription.featured_on_homepage === true">
                        <i class="el-icon-star-on"/> highlighted in a moving gallery on the main page in the results
                        searches and categories
                      </div>
                      <div class="list-item" v-if="subscription.bargain_price / 100 === 0">
                        <i class="el-icon-star-on"/> Yellow frame with the words "Chance"
                      </div>
                    </div>
                    <el-row :class="[ subscription.bargain_price === 0 ? 'hidden' : '' ]">
                      <el-col :span="20">
                        <div class="grid-content bg-purple">
                          Add a yellow text frame
                          <el-button class="button_bargain" size="mini">OKAZJA</el-button>
                          (za jedyne <strong>{{ subscription.bargain_price / 100 }} zloty</strong>)
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="grid-content bg-purple-light subscription-switch-right">
                          <el-switch
                            :class="[ subscription.bargain_price === 0 ? 'hidden is-checked' : '' ]"
                            v-model="form.subscriptions[subscription.id].is_bargain"
                            :value="true"
                            @set-value="form.is_bargain = $event"
                          ></el-switch>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="20">
                        <div class="grid-content bg-purple">
                          Add a red frame with the inscription
                          <el-button class="button_urgent" size="mini">URGENT</el-button>
                          (for only <strong>{{ subscription.urgent_price / 100 }} zloty</strong>)
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="grid-content bg-purple-light subscription-switch-right">
                          <el-switch
                            v-model="form.subscriptions[subscription.id].is_urgent"
                            :value="form.is_urgent"
                            @change="setUrgentValue"
                          ></el-switch>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">1 podbicie</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple-light"><strong>{{ subscription.raise_price / 100 }}
                          zloty</strong></div>
                      </el-col>
                      <el-col :span="4" :offset="4">
                        <div class="grid-content bg-purple-light subscription-switch-right">
                          <el-switch
                            v-model="form.subscriptions[subscription.id].has_raise_one"
                            :value="form.has_raise_one"
                            @set-value="form.has_raise_one = $event"
                          ></el-switch>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">3 podbicia</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple-light"><strong>{{ subscription.raise_price_three / 100 }}
                          zloty</strong></div>
                      </el-col>
                      <el-col :span="4" :offset="4">
                        <div class="grid-content bg-purple-light subscription-switch-right">
                          <el-switch
                            v-model="form.subscriptions[subscription.id].has_raise_three"
                            :value="form.has_raise_three"
                            @set-value="form.has_raise_three = $event"
                          ></el-switch>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">10 podbić</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple-light"><strong>{{ subscription.raise_price_ten / 100 }}
                          zloty</strong></div>
                      </el-col>
                      <el-col :span="4" :offset="4">
                        <div class="grid-content bg-purple-light subscription-switch-right">
                          <el-switch
                            v-model="form.subscriptions[subscription.id].has_raise_ten"
                            :value="form.has_raise_ten"
                            @set-value="form.has_raise_ten = $event"
                          ></el-switch>
                        </div>
                      </el-col>
                    </el-row>
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
          Are you in a hurry? Activate "<span>Urgent</span>"
        </div>
        <toggle-button
          v-model="form.attributes[20]"
          color="#ff19b7"
          :value="form.attributes[20]"
          :sync="true"
          :labels="{checked: 'Yes', unchecked: 'No'}"
          @change="setUrgentValue"
        />
      </div>
      <div v-if="!user.isLogged && viewType !== 'update'" class="contact-form">
        <el-form-item label="I am">
          <el-button
            type="plain"
            :class="[ form.user.account_type === 'user' ? 'active' : '' ]"
                     @click="setUserType('user')">
            Private person
          </el-button>
          <el-button
            type="plain"
            :class="[ form.user.account_type === 'agency' ? 'active' : '' ]"
                     @click="setUserType('agency')">
            Real estate agency
          </el-button>
          <el-button
            type="plain"
            :class="[ form.user.account_type === 'developer' ? 'active' : '' ]"
                     @click="setUserType('developer')">
            Developer
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.user.account_type === 'user'" label="Name" prop="user.name">
          <el-input v-model="form.user.name" placeholder="Name"/>
        </el-form-item>
        <el-form-item v-if="form.user.account_type !== 'user'" label="Company Namey" prop="user.name">
          <el-input v-model="form.user.name" placeholder="Company Name"/>
        </el-form-item>
        <el-row class="contact">
          <el-col :span="12">
            <el-form-item label="Phone number">
              <el-input
                type="number"
                min="0"
                v-model="form.user.phone"
                placeholder="Phone number"
                onkeyup="value = value.replace(/[^\d]/g, 0)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email" prop="user.email">
              <el-input v-model="form.user.email" placeholder="Email"/>
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
              Click to add
            </el-button>
            <div slot="tip" class="el-upload__tip">
              <!-- Płatne 5zł ważne na 30dni -->
              {{ avatarLimitMsg }}
            </div>
            <div slot="tip" class="el-upload__tip fw-bld">
              <span class="_error">Attention!</span> To properly add a link to a video, please refer to the section on adding links in
                <a
                  href="/faq"
                  target="_blank"
                  class="bld"
                >
                  FAQ
                </a>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="['agency', 'developer', 'user'].includes(form.user.account_type)" label="Video avatar">
          <el-input v-model="form.user.videoAvatar" type="text" placeholder="Link to the movie on YouTube"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Hasło" prop="user.password">
              <el-input v-model="form.user.password" type="password" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Potwórz hasło" prop="user.rePassword">
              <el-input v-model="form.user.rePassword" type="password" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="user.isLogged" class="contact-form">
        <el-form-item label="Jestem">
          <div
            v-if="form.user.account_type !== 'agent'"
          >
            <el-button
              type="plain"
              :class="[ form.user.account_type === 'user' ? 'active' : '' ]"
              disabled
              @click="setUserType('user')"
            >
              Private person
            </el-button>
            <el-button
              type="plain"
              :class="[ form.user.account_type === 'agency' ? 'active' : '' ]"
              disabled
              @click="setUserType('agency')"
            >
              Real estate agency
            </el-button>
            <el-button
              type="plain"
              :class="[ form.user.account_type === 'developer' ? 'active' : '' ]"
              disabled
              @click="setUserType('developer')"
            >
              Deweloperem
            </el-button>
          </div>
          <el-button
            v-else
            type="plain"
            class="active"
            disabled
            @click="setUserType('user')"
          >
            Agent
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.user.account_type === 'user'" label="Name">
          <el-input v-model="user.name" placeholder="Name" disabled/>
        </el-form-item>
        <el-form-item v-if="form.user.account_type === 'agent'" label="In company">
          <el-input v-model="user.name" placeholder="In company" disabled/>
        </el-form-item>
        <el-form-item v-if="form.user.account_type !== 'user' && form.user.account_type !== 'agent'" label="Company name">
          <el-input v-model="user.name" placeholder="Company name" disabled/>
        </el-form-item>
        <el-row class="contact">
          <el-col :span="12">
            <el-form-item label="Phone number">
              <el-input v-model="user.phone" placeholder="Phone number" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input v-model="user.email" placeholder="Email" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item class="add-btn">
        <el-button v-if="viewType === 'create'" type="primary" @click="onSubmit(true)">
          Preview
        </el-button>
        <el-button v-if="viewType === 'create'" type="primary" @click="onSubmit(false)">
          Post Ad
        </el-button>
        <el-button v-if="viewType === 'update'" @click="cancelEdit">
          Cancel
        </el-button>
        <el-button v-if="viewType === 'update'" type="primary" @click="onSubmitEdit">
          Zapisz zmiany
        </el-button>
        <el-button v-if="viewType === 'preview'" type="primary" @click="onSubmitPreview(true)">
          Preview
        </el-button>
        <el-button v-if="viewType === 'preview'" type="primary" @click="onSubmitPreview(false)">
          Post Ad
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as Cookies from 'js-cookie'
import { store, show, update, previewStore, previewShow, previewMigrate, previewUpdate } from '@/api/offer'
import { getLocation } from '@/api/osm'
import { mapOfferModelToOfferForm } from '@/helpers'
import { index } from '@/api/subscriptions'
import { getSettings } from '@/api/setting'
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
        callback(new Error('Enter the password'))
      } else {
        if (this.form.password !== '') {
          this.$refs.form.validateField('rePassword')
        }
        callback()
      }
    }
    const validateUrl = (rule, value, callback) => {
      let url
      if (!value) {
        callback()
        return
      }
      try {
        url = new URL(value)
      } catch (_) {
        callback(new Error('Enter the URL of the video'))
        return
      }
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        if (url.hostname === 'youtu.be' || url.hostname === 'vimeo.com') {
          callback()
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      user: {},
      addOfferForm: {},
      failShake: true,
      datePickerOptions: {
        disabledDate (date) {
          return date < new Date()
        }
      },
      avatars: [],
      subscriptions: [],
      selectedSubscription: 1,
      selectedPrice: 1,
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
        subscriptions: { 1: {}, 2: {}, 3: {}, 4: {} },
        location: '',
        mainImage: [],
        images: [],
        projectPlans: [],
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
          1: 'sale',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: false,
          9: '',
          11: '',
          12: [],
          13: '',
          14: '',
          15: [],
          16: [],
          17: [],
          18: '',
          19: '',
          20: false,
          21: '',
          22: ''
        },
        availableForOption: [
          {name: 'professionals', slug: 'professionals', offer_types: 'rent'}, 
          {name: 'students only', slug: 'students-only', offer_types: 'rent'}, 
          {name: 'Accepting DSS', slug: 'accepting-dss', offer_types: 'rent'}, 
          {name: 'Couples', slug: 'couples', offer_types: 'rent'}
        ],
        smokingOption: [
          {name: 'I don\'t mind', slug: 0, offer_types: 'rent'},
          {name: 'Yes', slug: 1, offer_types: 'rent'},
          {name: 'No', slug: 2, offer_types: 'rent'},
        ],
        petsOption: [
          {name: 'I don\'t mind', slug: 0, offer_types: 'rent'},
          {name: 'Yes', slug: 1, offer_types: 'rent'},
          {name: 'No', slug: 2, offer_types: 'rent'},
        ],
        genderOption: [
          {name: 'Any gender', slug: 0, offer_types: 'rent'},
          {name: 'Females Only', slug: 1, offer_types: 'rent'},
          {name: 'Males Only', slug: 2, offer_types: 'rent'},
        ],
        energyOption: [
          {name: 'Gas', slug: 'gas', offer_types: 'sell'},
          {name: 'Electricity', slug: 'electricity', offer_types: 'sell'},
          {name: 'Double glazing', slug: 'double-glazing', offer_types: 'sell'}, 
          {name: 'Triple glazing', slug: 'triple-glazing', offer_types: 'sell'},
          {name: 'Low carbon running', slug: 'low-carbon-running', offer_types: 'sell'},
          {name: 'Insulated', slug: 'insulated', offer_types: 'sell'},
          {name: 'Led pannels/lighing', slug: 'led-pannels', offer_types: 'sell'},
          {name: 'Photovolcanic panels', slug: 'photovolcanic', offer_types: 'sell'},
          {name: 'Solar Powered', slug: 'solar-powered', offer_types: 'sell'},
          {name: 'Wind turbines', slug: 'wind-turbines', offer_types: 'sell'},
        ],
        is_urgent: false,
        is_bargain: false,
        has_raise_one: false,
        has_raise_three: false,
        has_raise_ten: false
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      projectFileList: [],
      mainPhoto: [],
      marker: null,
      labelPosition: 'right',
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        category: { required: true, message: 'Category is required', trigger: 'change' },
        'links.video': [
          { validator: validateUrl, trigger: 'blur' }
        ],
        'links.video_2': [
          { validator: validateUrl, trigger: 'blur' }
        ],
        'links.walk_video': [
          { validator: validateUrl, trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'Price is required', trigger: 'change' }
        ],
        title: [
          { required: true, message: 'Title is required', trigger: 'change' },
          { max: 70, message: 'The title can be up to 70 characters long', trigger: 'change' }
        ],
        location: { required: true, message: 'Location is required', trigger: 'change' },
        description: { required: true, message: 'Description is required', trigger: 'change' },
        'user.email': { required: true, message: 'Email is required', trigger: 'change' },
        'user.password': { required: true, message: 'Password is required', trigger: 'change' },
        'user.rePassword': { required: true, message: 'Repeat password is required', trigger: 'change' },
        'user.name': { required: true, message: 'First name or Company name is required', trigger: 'change' }
      },
      isPhotoLimitReached: true,
      settingData: [],
      avatarLimitMsg: '',
      avatarPrice: '',
      photoLimitMsg: '',
      linkLimitMsg: '',
      dateLimitMsg: '',
      photoPrice: 0,
      linkPrice: 0,
      datePrice: 0,
      isLocalData: true,
      isGlobal: false
    }
  },
  computed: {
    mapStyle () {
      return this.$config.mapStyle
    },
    formattedVideo: {
      get () {
        return this.form.links.video
      },
      set (newValue) {
        this.form.links.video = newValue.replace('://m.', '://')
      }
    },
    formattedVideo2: {
      get () {
        return this.form.links.video_2
      },
      set (newValue) {
        this.form.links.video_2 = newValue.replace('://m.', '://')
      }
    },
    formattedWalkVideo: {
      get () {
        return this.form.links.walk_video
      },
      set (newValue) {
        this.form.links.walk_video = newValue.replace('://m.', '://')
      }
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
    },
    formattedAttribute21Price: {
      get () {
        return this.form.attributes[21].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set (newValue) {
        this.form.attributes[21] = newValue.replace(/\s/g, '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      }
    },
    isPreview () {
      return Object.prototype.hasOwnProperty.call(this.$route.query, 'preview') && this.$route.query.preview
    }
  },
  async mounted () {
    this.addOfferForm = this.$store.state.addOfferForm;
    this.user = this.$store.state.user;

    this.setType('sell')
    if (window.innerWidth < 700) {
      this.labelPosition = 'top'
    }
    await this.getSubscriptions()
    await this.getSettingsValues()
    if ('option' in this.$route.query) {
      this.selectedSubscription = parseInt(this.$route.query.option)
      let addPackage = localStorage.getItem('add-form') ? localStorage.getItem('add-form') : null
      if (addPackage && this.selectedSubscription && this.isLocalData === true) {
        console.log('inside the package')
        addPackage = JSON.parse(addPackage)
        this.isLocalData = false
        this.form.subscriptions[this.selectedSubscription].has_raise_three = addPackage.subscriptions[this.selectedSubscription].has_raise_three
        this.form.subscriptions[this.selectedSubscription].has_raise_one = addPackage.subscriptions[this.selectedSubscription].has_raise_one
        this.form.subscriptions[this.selectedSubscription].is_urgent = addPackage.subscriptions[this.selectedSubscription].is_urgent
        this.form.subscriptions[this.selectedSubscription].is_bargain = addPackage.subscriptions[this.selectedSubscription].is_bargain
        this.form.subscriptions[this.selectedSubscription].has_raise_ten = addPackage.subscriptions[this.selectedSubscription].has_raise_ten
        localStorage.removeItem('add-form')
      }
    }
    if (this.user.isLogged) {
      this.form.user.account_type = this.user.roles[0];
      if(this.form.user.account_type === 'company'){
        this.form.user.account_type = this.user.type;
      }
    }
    if (this.$route.params.slug) {
      let result = {}
      if (this.isPreview && !this.user.isLogged) {
        result = await previewShow(this.$route.params.slug)
      } else {
        result = await show(this.$route.params.slug, this.categories)
      }
      if (result.status === 200) {
        if (this.isPreview && !this.user.isLogged) {
          this.viewType = 'preview'
        } else {
          this.viewType = 'update'
        }
        this.offer = result.data
        const eFormData = this.fillForm(result.data)
        for (const e in eFormData) {
          this.form[e] = eFormData[e]
        }
        this.$store.dispatch('addOfferForm/setType', this.form.attributes[1])
        // this.form = eFormData
        this.fileList = this.form.images
        this.projectFileList = this.form.projectPlans
        this.locations = [{
          lat: this.offer.location.lat,
          lon: this.offer.location.lon,
          display_name: this.offer.location.name,
          osm_id: new Date().getTime()
        }]
        this.form.location = this.offer.location.lat + '*' + this.offer.location.lon + '*' + this.offer.location.name
        const localData = localStorage.getItem('offer') ? JSON.parse(localStorage.getItem('offer')) : null
        if (localData) {
          this.form.user.account_type = localData.user.account_type
          this.form.user.name = localData.user.name ? localData.user.name : ''
          this.form.user.email = localData.user.email ? localData.user.email : ''
          this.form.user.phone = localData.user.phone ? localData.user.phone : 0
        }
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
      const coords = location.split('*')
      return [coords[0], coords[1]]
    },
    onSubmit (preview) {
      this.processing = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.processing = false
          this.$message({
            message: 'Correct the form for adding an advertisement',
            type: 'error',
            duration: 3000
          })
          return false
        } else {
          this.addOffer(preview)
        }
      })
    },
    onSubmitPreview (preview) {
      this.processing = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.processing = false
          this.$message({
            message: 'Correct the form for adding an advertisement',
            type: 'error',
            duration: 3000
          })
          return false
        } else {
          this.previewOffer(preview)
        }
      })
    },
    changeLatLngAfterDrag (event) {
      const latLng = this.$refs.marker.mapObject.getLatLng()
      const location = this.form.location.split('*')
      this.locations = [{ lat: latLng.lat, lon: latLng.lng, display_name: location[2], osm_id: new Date().getTime() }]
      this.form.location = latLng.lat + '*' + latLng.lng + '*' + location[2]
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
    async previewOffer (preview) {
      const formData = this.makeFormData()
      formData.append('preview', preview)
      if (preview && !this.user.isLogged) {
        localStorage.setItem('offer', JSON.stringify(this.form))
      }
      try {
        let result = {}
        if (preview) {
          result = await previewUpdate(this.offer.slug, formData)
        } else {
          result = await previewMigrate(this.offer.slug, formData)
          localStorage.removeItem('offer')
        }
        const offerSlug = result.data.offer_slug === undefined ? result.data.slug : result.data.offer_slug
        if (preview && (result.status === 200 || result.status === 201)) {
          Cookies.set('offer-token', result.data.offer_token, { expires: 1 })
          await this.$router.push('/ogloszenia/' + offerSlug + '?preview=true')
        } else if (result.status === 201) {
          this.$message({
            message: 'Announcement added',
            type: 'success',
            duration: 3000
          })
          this.processing = false
          await this.$router.push('/moje-ogloszenia')
        } else if (result.status === 200) {
          this.processing = false
          if (this.user.isLogged) {
            await this.$router.push('/moje-ogloszenia/oplac/' + offerSlug)
          } else {
            this.$message({
              message: 'A link to activate the account and pay for the advertisement has been sent to the e-mail address provided',
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
    async addOffer (preview) {
      const formData = this.makeFormData()
      formData.append('preview', preview)
      if (preview && !this.user.isLogged) {
        console.log(this.form)
        console.log(formData)
        localStorage.setItem('offer', JSON.stringify(this.form))  
        // return
      }
      try {
        let result = {}
        if (preview && !this.user.isLogged) {
          result = await previewStore(formData)
        } else {
          result = await store(formData)
        }
        const offerSlug = result.data.offer_slug === undefined ? result.data.slug : result.data.offer_slug
        if (preview && (result.status === 200 || result.status === 201)) {
          Cookies.set('offer-token', result.data.offer_token, { expires: 1 })
          await this.$router.push('/ogloszenia/' + offerSlug + '?preview=true')
        } else if (result.status === 201) {
          this.$message({
            message: 'Ad added',
            type: 'success',
            duration: 3000
          })
          this.processing = false
          await this.$router.push('/moje-ogloszenia')
        } else if (result.status === 200) {
          this.processing = false
          if (this.user.isLogged) {
            await this.$router.push('/moje-ogloszenia/oplac/' + offerSlug)
          } else {
            this.$message({
              message: 'A link to activate the account and pay for the advertisement has been sent to the e-mail address provided',
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
    cancelEdit () {
      this.$router.push('/moje-ogloszenia')
    },
    async onSubmitEdit () {
      this.processing = true
      const formData = this.makeFormData()
      // If user is not logged it send request with preview param.
      formData.append('preview', !this.user.isLogged)
      const result = await update(this.offer.slug, formData)
      if (result.status === 200 && result.data.bill_amount !== undefined) {
        this.processing = false
        if (this.user.isLogged) {
          // await this.$router.push('/moje-ogloszenia/oplac/' + result.data.offer_slug)
        } else {
          this.$message({
            message: 'A link to activate the account and pay for the advertisement has been sent to the e-mail address provided',
            type: 'success',
            duration: 3000
          })
          // await this.$router.push('/')
        }
      } else if (result.status === 200) {
        this.$message({
          message: 'Announcement updated',
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

      const location = this.form.location.split('*')
      // formData.append('lat', '223')
      // formData.append('lon', '222')
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
      for (const image in this.form.projectPlans) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.form.projectPlans.hasOwnProperty(image)) {
          formData.append(`projectPlans[${image}]`, this.form.projectPlans[image].raw)
        }
      }
      if (!this.user.isLogged) {
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
        formData.append('is_urgent', this.setFormBoolValue(this.form.subscriptions[this.selectedSubscription].is_urgent))
        formData.append('is_bargain', this.setFormBoolValue(this.form.subscriptions[this.selectedSubscription].is_bargain))
        formData.append('has_raise_one', this.setFormBoolValue(this.form.subscriptions[this.selectedSubscription].has_raise_one))
        formData.append('has_raise_three', this.setFormBoolValue(this.form.subscriptions[this.selectedSubscription].has_raise_three))
        formData.append('has_raise_ten', this.setFormBoolValue(this.form.subscriptions[this.selectedSubscription].has_raise_ten))
      }

      return formData
    },
    setFormBoolValue (value) {
      let val = value
      if (typeof value === 'undefined' || value === undefined) {
        val = false
      }
      return val
    },
    setType (type) {
      this.form.attributes[1] = type
      this.$store.dispatch('addOfferForm/setType', type)
    },
    setUrgentValue (e) {
      console.log(e)
      if (typeof e === 'object') {
        this.form.is_urgent = this.form.attributes[20] = this.form.subscriptions[this.selectedSubscription].is_urgent = e.value
        this.isGlobal = true
      } else {
        this.form.is_urgent = this.form.attributes[20] = this.form.subscriptions[this.selectedSubscription].is_urgent = e
        this.isGlobal = false
      }
    },
    selectPackage (id) {
      if (this.selectedSubscription !== id) {
        console.log('seleccted package')
        this.selectedSubscription = id
        this.form.subscriptions[this.selectedSubscription].is_urgent = this.form.urgent = this.form.attributes[20]
        /* if (this.isGlobal) {
          this.form.subscriptions[this.selectedSubscription].is_urgent = this.form.urgent = this.form.attributes[20]
        } else {
          this.form.subscriptions[this.selectedSubscription].is_urgent = this.form.urgent = this.form.attributes[20] = false
        } */
      }
    },
    setUserType (type) {
      this.form.user.account_type = type
    },
    handleRemove (file) {
      //
    },
    handleChangeImages (files) {
      this.form.images = files
      /* if (this.form.images.length >= 3) {
        this.isPhotoLimitReached = true
      } else {
        this.isPhotoLimitReached = false
      } */
    },
    handleChangeProjectImages (files) {
      this.form.projectPlans = files
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
    async getSettingsValues () {
      const result = await getSettings()
      this.settingData = result.data
      this.settingData.forEach((item, index) => {
        item.value = (item.value / 100).toFixed(2)
        if (item.name === 'photo.price') {
          this.photoLimitMsg = `the first 3 pictures are free after that ${item.value} zloty`
          this.photoPrice = item.value
        }
        if (item.name === 'link.price') {
          this.linkLimitMsg = `Each link is paid ${item.value} zloty`
          this.linkPrice = item.value
        }
        if (item.name === 'visible_from_date.price') {
          this.dateLimitMsg = `This option is paid ${item.value} zloty`
          this.datePrice = item.value
        }
        if (item.name === 'avatar_photo.price') {
          this.avatarLimitMsg = `Paid ${item.value}PLN valid for 30 days`
          this.avatarPrice = item.value
        }
      })
    },
    setDescValue (value) {
      this.form.description = value
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
  width: 88% !important;
  margin-top: 20px;

  .el-input__inner {
    color: #000000;
  }

  .el-row {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
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
    border-color: #ceefdd !important;
    background-color: #ff19b7 !important;
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
    align-items: baseline;
    padding: 10px 0;

    .sub-box {
      margin-bottom: 20px;
      border-radius: 32px;
    }

    .active {
      box-shadow: 0 0 0 2pt #ff56c0;
    }

    .el-card {
      border-radius: 32px;
    }

    .el-card__body {
      padding: 10px;

      .list {
        height: 72px;

        .list-item {
          i {
            font-weight: bold;
            color: #ff9b2f;
          }
        }
      }

    }

    .card-box {
      width: 312px;
      height: 400px;
      cursor: pointer;

      .card-body {
        p {
          line-height: 24px;
        }

        .price {
          text-align: center;
          font-weight: bold;
          font-size: 36px;
          color: #FF19B7;
          padding: 10px;

          sup {
            font-size: 12px;
            color: #000000;
          }
        }

        span.upper {
          text-transform: uppercase;
        }

        .bottom {
          text-align: center;
        }
      }
    }
  }

  .button_urgent {
    background-color: #F50000;
    color: white;
    font-weight: 500;
    border-radius: 6px !important;
    /* font-family: sans-serif; */
    padding: 4px;
  }

  .button_bargain {
    background-color: #FFE122;
    color: black;
    font-weight: 500;
    border-radius: 6px !important;
    /* font-family: sans-serif; */
    padding: 4px;
  }

  .subscription-header {
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 1px;
  }

  .subscription-options {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 15px;
    text-align: left;
  }

  .subscription-switch-right {
    text-align: right;
  }

  .list-item {
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .subscription-box-0 {
    // height: 380px !important;
    height: unset !important;
    min-height: 550px;
  }

  .subscription-box-1 {
    // height: 420px !important;
    height: unset !important;
    min-height: 550px;
  }

  .subscription-box-2 {
    // height: 490px !important;
    height: unset !important;
    min-height: 550px;
  }

  .subscription-box-3 {
    // height: 490px !important;
    height: unset !important;
    min-height: 550px;
  }
  .starred {
    margin-bottom: 30px;
  }
  .hidden {
    display: none;
  }
  .upload-demo {
    .bld {
      font-weight: bold;
      color: #000000 !important
      ;
      text-decoration: underline !important;
    }
    .el-upload-list {
      width: 30% !important;
    }
  }
  .fw-bld {
    font-weight: bolder;
  }
  ._error {
    color: #F56C6C;
  }
}
</style>
