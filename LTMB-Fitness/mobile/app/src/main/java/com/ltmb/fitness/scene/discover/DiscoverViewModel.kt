package com.ltmb.fitness.scene.discover

import android.app.Application
import com.ltmb.fitness.base.BaseAndroidViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class DiscoverViewModel @Inject constructor(
    application: Application
) : BaseAndroidViewModel(application) {

    fun goToWorkoutPlan() {
        navigate(DiscoverFragmentDirections.toWorkoutPlanFragment())
    }

    fun goToMealPlane() {
        navigate(DiscoverFragmentDirections.toMealPlanFragment())
    }
}