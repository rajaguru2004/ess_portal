import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/home_response_model.dart';

/// Local data source for home screen data
/// Loads and validates data from static JSON file
class HomeLocalSource {
  HomeResponse? _homeResponse;

  /// Load home data from JSON asset
  Future<HomeResponse> getHomeData() async {
    // If data is already loaded, return it (caching)
    // Uncomment the lines below if you want simple caching
    // if (_homeResponse != null) {
    //   return _homeResponse!;
    // }

    try {
      // Load JSON from assets
      final String jsonString = await rootBundle.loadString(
        'assets/data/home_response.json',
      );

      // Parse JSON
      final Map<String, dynamic> jsonData = json.decode(jsonString);

      // Convert to model
      _homeResponse = HomeResponse.fromJson(jsonData);

      return _homeResponse!;
    } catch (e) {
      throw Exception('Failed to load home data: $e');
    }
  }
}
